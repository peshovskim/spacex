using SpaceX.Application.Missions.Responses;
using SpaceX.Domain.Missions.Enum;
using SharedKernel;

namespace SpaceX.Application.Missions.Interfaces;

public interface ISpaceXClient
{
    Task<Result<MissionsReadModel>> QueryLaunchesAsync(
        MissionsLaunchScope type,
        CancellationToken cancellationToken = default);
}
