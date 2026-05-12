using MediatR;
using SpaceX.Application.Launches;
using SpaceX.Application.Launches.Interfaces;
using SpaceX.Application.Launches.Responses;
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
    private readonly ISpaceXLaunchClient _spaceXClient;

    public GetLaunchesQueryHandler(ISpaceXLaunchClient spaceXClient)
    {
        _spaceXClient = spaceXClient;
    }

    public Task<Result<LaunchesReadModel>> Handle(GetLaunchesQuery request, CancellationToken cancellationToken)
    {
        Result<LaunchFilter> normalized = GetLaunchesSpacexQueryNormalizer.Normalize(request);

        if (normalized.IsFailure)
        {
            return Task.FromResult(Result.FromError<LaunchFilter, LaunchesReadModel>(normalized));
        }

        return _spaceXClient.QueryAsync(normalized.Value!, cancellationToken);
    }
}
