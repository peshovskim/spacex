using SpaceX.Application.Missions.Responses;
using SpaceX.Domain.Missions.Enum;
using SharedKernel;

namespace SpaceX.Application.Missions.Interfaces;

public interface IMissionsReadRepository
{
    Task<Result<PaginatedLaunchesReadModel>> GetLaunchesAsync(
        MissionsLaunchScope scope,
        CancellationToken cancellationToken = default);
}
