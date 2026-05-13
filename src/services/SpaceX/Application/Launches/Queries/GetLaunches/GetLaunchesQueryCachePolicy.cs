using SpaceX.Application.Launches;
using SpaceX.Domain.Launches.Enum;

namespace SpaceX.Application.Launches.Queries.GetLaunches;

public static class GetLaunchesQueryCachePolicy
{
    public const string DefaultFirstPageCacheKey = "launches:default-first-page";

    public static bool IsDefaultFirstPage(LaunchFilter filter)
    {
        return filter.Type == LaunchType.Upcoming
            && filter.Page == 0
            && filter.PageSize == 10
            && filter.SortField == "date_utc"
            && filter.SortDirection == "asc";
    }
}
