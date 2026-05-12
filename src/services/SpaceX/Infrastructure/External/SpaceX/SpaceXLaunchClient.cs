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
    private const int DefaultListLimit = 10;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly HttpClient _httpClient;

    public SpaceXLaunchClient(IOptions<SpaceXApiOptions> options)
    {
        SpaceXApiOptions o = options.Value;
        var baseUrl = o.BaseUrl.Trim().TrimEnd('/') + "/";

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
        var body = new SpaceXQuery
        {
            Query = BuildQuery(type),
            Options = BuildOptions(type),
        };

        using HttpResponseMessage response = await _httpClient.PostAsJsonAsync(
            "launches/query",
            body,
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return Result<LaunchesReadModel>.InternalError(ResultCodes.InternalError,
                $"SpaceX API returned {(int)response.StatusCode}.");
        }

        string json = await response.Content.ReadAsStringAsync(cancellationToken);

        using JsonDocument doc = JsonDocument.Parse(json);

        JsonElement docs = doc.RootElement.GetProperty("docs");

        LaunchReadModel[]? launches = docs.Deserialize<LaunchReadModel[]>(JsonOptions);

        return Result<LaunchesReadModel>.Success(
            new LaunchesReadModel { Launches = launches ?? [] });
    }

    private static object BuildQuery(LaunchType type)
    {
        switch (type)
        {
            case LaunchType.Upcoming:
                return new { upcoming = true };

            case LaunchType.Past:
                return new { upcoming = false };

            case LaunchType.Latest:
                return new { upcoming = false };

            default:
                return new { upcoming = true };
        }
    }

    private static object BuildOptions(LaunchType type)
    {
        switch (type)
        {
            case LaunchType.Upcoming:
                return new
                {
                    limit = DefaultListLimit,
                    sort = new
                    {
                        date_utc = "asc"
                    }
                };
            case LaunchType.Latest:
                return new
                {
                    limit = 1,
                    sort = new
                    {
                        date_utc = "desc"
                    }
                };
            case LaunchType.Past:
                return new
                {
                    limit = DefaultListLimit,
                    sort = new
                    {
                        date_utc = "desc"
                    }
                };
            default:
                return new
                {
                    limit = DefaultListLimit,
                    sort = new
                    {
                        date_utc = "asc"
                    }
                };
        }
    }
}
