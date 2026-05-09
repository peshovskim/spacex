using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SpaceX.Application.Launches.Interfaces;
using SpaceX.Application.Launches.Responses;
using SpaceX.Domain.Launches.Enum;
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

    public async Task<Result<LaunchesReadModel>> QueryLaunchesAsync(
        LaunchScope type,
        CancellationToken cancellationToken = default)
    {
        object body = BuildBody(type);

        using HttpResponseMessage response = await _httpClient.PostAsJsonAsync(
            "launches/query",
            body,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        string json = await response.Content.ReadAsStringAsync(cancellationToken);

        using JsonDocument doc = JsonDocument.Parse(json);
        JsonElement docs = doc.RootElement.GetProperty("docs");

        LaunchReadModel[]? launches = docs.Deserialize<LaunchReadModel[]>(JsonOptions);

        return Result<LaunchesReadModel>.Success(
            new LaunchesReadModel { Launches = launches ?? [] });
    }

    private static object BuildBody(LaunchScope type)
    {
        return type switch
        {
            LaunchScope.Latest => new
            {
                query = new { upcoming = false },
                options = new
                {
                    limit = 1,
                    sort = new { date_utc = "desc" },
                },
            },
            LaunchScope.Upcoming => new
            {
                query = new { upcoming = true },
                options = new { },
            },
            LaunchScope.Past => new
            {
                query = new { upcoming = false },
                options = new { pagination = false },
            },
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null),
        };
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
