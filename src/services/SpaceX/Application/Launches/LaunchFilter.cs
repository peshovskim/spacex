using SpaceX.Domain.Launches.Enum;

namespace SpaceX.Application.Launches;

public sealed record LaunchFilter(
    LaunchType Type,
    int Page,
    int PageSize,
    string SortField,
    string SortDirection);
