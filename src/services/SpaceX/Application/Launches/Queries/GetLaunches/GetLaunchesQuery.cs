using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using SpaceX.Application.Launches.Interfaces;
using SpaceX.Application.Launches.Responses;
using SpaceX.Application.Options;
using SpaceX.Domain.Launches.Enum;
using SharedKernel;
using SharedKernel.Cqrs;

namespace SpaceX.Application.Launches.Queries.GetLaunches;

public sealed record GetLaunchesQuery(
    LaunchType Type = LaunchType.Upcoming,
    int Page = 0,
    int PageSize = 10,
    string? SortField = null,
    string? SortDirection = null)
    : IQuery<Result<LaunchesReadModel>>;

public sealed class GetLaunchesQueryHandler : IRequestHandler<GetLaunchesQuery, Result<LaunchesReadModel>>
{
    private static readonly JsonSerializerOptions CacheJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    private static readonly TimeSpan DefaultFirstPageTtl = TimeSpan.FromMinutes(2);

    private readonly ISpaceXLaunchClient _spaceXClient;
    private readonly IDistributedCache _cache;
    private readonly IOptions<CachingOptions> _cachingOptions;

    public GetLaunchesQueryHandler(
        ISpaceXLaunchClient spaceXClient,
        IDistributedCache cache,
        IOptions<CachingOptions> cachingOptions)
    {
        _spaceXClient = spaceXClient;
        _cache = cache;
        _cachingOptions = cachingOptions;
    }

    public async Task<Result<LaunchesReadModel>> Handle(GetLaunchesQuery request, CancellationToken cancellationToken)
    {
        Result<LaunchFilter> normalized = GetLaunchesSpacexQueryNormalizer.Normalize(request);

        if (normalized.IsFailure)
        {
            return Result.FromError<LaunchFilter, LaunchesReadModel>(normalized);
        }

        LaunchFilter filter = normalized.Value!;

        bool useCache = _cachingOptions.Value.UseRedis;

        if (useCache && GetLaunchesQueryCachePolicy.IsDefaultFirstPage(filter))
        {
            try
            {
                byte[]? cached = await _cache.GetAsync(
                    GetLaunchesQueryCachePolicy.DefaultFirstPageCacheKey,
                    cancellationToken);

                if (cached is not null)
                {
                    LaunchesReadModel? fromCache =
                        JsonSerializer.Deserialize<LaunchesReadModel>(cached, CacheJsonOptions);

                    if (fromCache is not null)
                    {
                        return Result<LaunchesReadModel>.Success(fromCache);
                    }
                }
            }
            catch (Exception)
            {
                // Continue to external API if cache read fails.
            }
        }

        Result<LaunchesReadModel> result = await _spaceXClient.QueryAsync(filter, cancellationToken);

        if (useCache
            && result is { IsSuccess: true, Value: not null }
            && GetLaunchesQueryCachePolicy.IsDefaultFirstPage(filter))
        {
            try
            {
                byte[] payload = JsonSerializer.SerializeToUtf8Bytes(result.Value, CacheJsonOptions);
                await _cache.SetAsync(
                    GetLaunchesQueryCachePolicy.DefaultFirstPageCacheKey,
                    payload,
                    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = DefaultFirstPageTtl },
                    cancellationToken);
            }
            catch
            {
                // Continue so a failed cache write does not fail the query.
            }
        }

        return result;
    }
}
