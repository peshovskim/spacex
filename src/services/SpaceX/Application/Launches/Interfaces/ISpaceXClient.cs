using SpaceX.Application.Launches.Responses;
using SpaceX.Domain.Launches.Enum;
using SharedKernel;

namespace SpaceX.Application.Launches.Interfaces;

public interface ISpaceXClient
{
    Task<Result<LaunchesReadModel>> QueryLaunchesAsync(
        LaunchScope type,
        CancellationToken cancellationToken = default);
}
