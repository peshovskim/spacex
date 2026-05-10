using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SpaceX.Application.Launches.Interfaces;
using SpaceX.Application.Launches.Responses;
using SpaceX.Domain.Launches.Enum;
using SpaceX.Infrastructure.Options;
using SharedKernel;

namespace SpaceX.Infrastructure.External.SpaceX;

public sealed class SpaceXLaunchClient : ISpaceXLaunchClient
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly HttpClient _httpClient;

    public SpaceXLaunchClient(IOptions<SpaceXApiOptions> options)
    {
        SpaceXApiOptions o = options.Value;
        var baseUrl = o.BaseUrl;

        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(baseUrl),
            Timeout = TimeSpan.FromMinutes(5),
        };
    }

    public async Task<Result<LaunchesReadModel>> QueryAsync(
        LaunchType type,
        CancellationToken cancellationToken = default)
    {
        var body = new
        {
            query = new { upcoming = true },
            options = new { },
        };

        using HttpResponseMessage response = await _httpClient.PostAsJsonAsync(
            "launches/query",
            body,
            cancellationToken);

        string json = await response.Content.ReadAsStringAsync(cancellationToken);

        using JsonDocument doc = JsonDocument.Parse(json);

        JsonElement docs = doc.RootElement.GetProperty("docs");

        LaunchReadModel[]? launches = docs.Deserialize<LaunchReadModel[]>(JsonOptions);

        return Result<LaunchesReadModel>.Success(
            new LaunchesReadModel { Launches = launches ?? [] });
    }
}
