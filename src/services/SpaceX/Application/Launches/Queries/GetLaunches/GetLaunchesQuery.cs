using MediatR;
using SpaceX.Application.Launches.Interfaces;
using SpaceX.Application.Launches.Responses;
using SpaceX.Domain.Launches.Enum;
using SharedKernel;
using SharedKernel.Cqrs;

namespace SpaceX.Application.Launches.Queries.GetLaunches;

public sealed record GetLaunchesQuery(LaunchScope Type = LaunchScope.Upcoming)
    : IQuery<Result<LaunchesReadModel>>;

public sealed class GetLaunchesQueryHandler : IRequestHandler<GetLaunchesQuery, Result<LaunchesReadModel>>
{
    private readonly ISpaceXClient _spaceXClient;

    public GetLaunchesQueryHandler(ISpaceXClient spaceXClient)
    {
        _spaceXClient = spaceXClient;
    }

    public Task<Result<LaunchesReadModel>> Handle(GetLaunchesQuery request, CancellationToken cancellationToken)
    {
        return _spaceXClient.QueryLaunchesAsync(request.Type, cancellationToken);
    }
}
