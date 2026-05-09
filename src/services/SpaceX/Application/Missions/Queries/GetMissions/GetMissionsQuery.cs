using MediatR;
using SpaceX.Application.Missions.Interfaces;
using SpaceX.Application.Missions.Responses;
using SpaceX.Domain.Missions.Enum;
using SharedKernel;
using SharedKernel.Cqrs;

namespace SpaceX.Application.Missions.Queries.GetMissions;

public sealed record GetMissionsQuery(MissionsLaunchScope Type = MissionsLaunchScope.Upcoming)
    : IQuery<Result<MissionsReadModel>>;

public sealed class GetMissionsQueryHandler : IRequestHandler<GetMissionsQuery, Result<MissionsReadModel>>
{
    private readonly ISpaceXClient _spaceXClient;

    public GetMissionsQueryHandler(ISpaceXClient spaceXClient)
    {
        _spaceXClient = spaceXClient;
    }

    public Task<Result<MissionsReadModel>> Handle(GetMissionsQuery request, CancellationToken cancellationToken)
    {
        return _spaceXClient.QueryLaunchesAsync(request.Type, cancellationToken);
    }
}
