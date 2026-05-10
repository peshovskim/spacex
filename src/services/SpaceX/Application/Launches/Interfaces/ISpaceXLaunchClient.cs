using SpaceX.Application.Launches.Responses;
using SpaceX.Domain.Launches.Enum;
using SharedKernel;

namespace SpaceX.Application.Launches.Interfaces;

public interface ISpaceXLaunchClient
{
    Task<Result<LaunchesReadModel>> QueryAsync(
        LaunchType type,
        CancellationToken cancellationToken = default);
}
