namespace SpaceX.Application.Launches.Responses;

public sealed class LaunchesReadModel
{
    public IReadOnlyList<LaunchReadModel> Launches { get; init; } = [];
}
