namespace SpaceX.Application.Missions.Responses;

public sealed class MissionsReadModel
{
    public IReadOnlyList<LaunchReadModel> Launches { get; init; } = [];
}
