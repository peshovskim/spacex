using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SpaceX.Application.Missions.Interfaces;
using SpaceX.Application.Missions.Responses;
using SpaceX.Domain.Missions.Enum;
using SpaceX.Infrastructure.Options;
using SharedKernel;

namespace SpaceX.Infrastructure.External.SpaceX;

public sealed class SpaceXClient : ISpaceXClient, IDisposable
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly HttpClient _httpClient;
    private bool _disposed;

    public SpaceXClient(IOptions<SpaceXApiOptions> options)
    {
        SpaceXApiOptions o = options.Value;
        var baseUrl = o.BaseUrl.Trim().TrimEnd('/') + "/";
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(baseUrl, UriKind.Absolute),
            Timeout = TimeSpan.FromMinutes(5),
        };
    }

    public async Task<Result<MissionsReadModel>> QueryLaunchesAsync(
        MissionsLaunchScope _,
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

        response.EnsureSuccessStatusCode();

        string json = await response.Content.ReadAsStringAsync(cancellationToken);

        using JsonDocument doc = JsonDocument.Parse(json);
        JsonElement docs = doc.RootElement.GetProperty("docs");

        LaunchReadModel[]? launches = docs.Deserialize<LaunchReadModel[]>(JsonOptions);

        return Result<MissionsReadModel>.Success(
            new MissionsReadModel { Launches = launches ?? [] });
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _httpClient.Dispose();
        _disposed = true;
    }
}
