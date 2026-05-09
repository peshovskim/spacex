using MediatR;
using SpaceX.Domain.Missions.Enum;
using SpaceX.Application.Missions.Interfaces;
using SpaceX.Application.Missions.Responses;
using SharedKernel;
using SharedKernel.Cqrs;

namespace SpaceX.Application.Missions.Queries.GetMissions;

public sealed record GetMissionsQuery(MissionsLaunchScope Scope = MissionsLaunchScope.Latest)
    : IQuery<Result<PaginatedLaunchesReadModel>>;

public sealed class GetMissionsQueryHandler : IRequestHandler<GetMissionsQuery, Result<PaginatedLaunchesReadModel>>
{
    private readonly IMissionsReadRepository _missionsReadRepository;

    public GetMissionsQueryHandler(IMissionsReadRepository missionsReadRepository)
    {
        _missionsReadRepository = missionsReadRepository;
    }

    public Task<Result<PaginatedLaunchesReadModel>> Handle(
        GetMissionsQuery request,
        CancellationToken cancellationToken)
    {
        return _missionsReadRepository.GetLaunchesAsync(request.Scope, cancellationToken);
    }
}
