using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SpaceX.Application.Launches;
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

        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(o.BaseUrl.TrimEnd('/') + "/"),
            Timeout = TimeSpan.FromMinutes(5),
        };
    }

    public async Task<Result<LaunchesReadModel>> QueryAsync(
        LaunchFilter criteria,
        CancellationToken cancellationToken = default)
    {
        var request = new
        {
            Query = BuildQuery(criteria.Type),
            Options = BuildOptions(criteria),
        };

        using HttpResponseMessage response = await _httpClient.PostAsJsonAsync(
            "launches/query",
            request,
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return Result<LaunchesReadModel>.InternalError(
                ResultCodes.InternalError,
                $"SpaceX API returned {(int)response.StatusCode}.");
        }

        using JsonDocument doc = await response.Content.ReadFromJsonAsync<JsonDocument>(
            cancellationToken: cancellationToken) ?? throw new InvalidOperationException();

        JsonElement root = doc.RootElement;

        LaunchReadModel[] launches =
            root.GetProperty("docs").Deserialize<LaunchReadModel[]>(JsonOptions) ?? [];

        int totalCount = root.TryGetProperty("totalDocs", out JsonElement total)
            ? total.GetInt32()
            : launches.Length;

        return Result<LaunchesReadModel>.Success(
            new LaunchesReadModel
            {
                Launches = launches,
                TotalCount = totalCount,
            });
    }

    private static object BuildQuery(LaunchType type)
    {
        switch (type)
        {
            case LaunchType.Upcoming:
                return new Dictionary<string, object>
                {
                    ["upcoming"] = true
                };

            case LaunchType.Past:
            case LaunchType.Latest:
                return new Dictionary<string, object>
                {
                    ["upcoming"] = false
                };

            default:
                return new Dictionary<string, object>
                {
                    ["upcoming"] = true
                };
        }
    }

    private static object BuildOptions(LaunchFilter criteria)
    {
        return new
        {
            limit = criteria.PageSize,
            offset = criteria.Page * criteria.PageSize,
            sort = new Dictionary<string, string>
            {
                [criteria.SortField] = criteria.SortDirection
            }
        };
    }
}
