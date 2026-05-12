using SpaceX.Application.Launches.Responses;
using SharedKernel;

namespace SpaceX.Application.Launches.Interfaces;

public interface ISpaceXLaunchClient
{
    Task<Result<LaunchesReadModel>> QueryAsync(
        LaunchFilter criteria,
        CancellationToken cancellationToken = default);
}
