using SpaceX.Application.Launches;
using SpaceX.Domain.Launches.Enum;
using SharedKernel;

namespace SpaceX.Application.Launches.Queries.GetLaunches;

public static class GetLaunchesSpacexQueryNormalizer
{
    private const int MinPageSize = 1;
    private const int MaxPageSize = 100;

    private static readonly List<string> AllowedSortFields =
    [
        "flight_number",
        "name",
        "details",
        "date_utc",
        "upcoming",
        "success",
    ];

    public static Result<LaunchFilter> Normalize(GetLaunchesQuery query)
    {
        if (query.Page < 0)
        {
            return Result<LaunchFilter>.Invalid(ResultCodes.Validation, "Ivalid query page");
        }

        if (query.PageSize is < MinPageSize or > MaxPageSize)
        {
            return Result<LaunchFilter>.Invalid(ResultCodes.Validation, "Ivalid query page size");
        }

        string sortField = NormalizeSortField(query.SortField);

        string sortDirection = NormalizeSortDirection(query.Type, query.SortField, query.SortDirection);

        if (!AllowedSortFields.Contains(sortField))
        {
            return Result<LaunchFilter>.Invalid(ResultCodes.Validation, "SortField is not supported.");
        }

        if (sortDirection is not ("asc" or "desc"))
        {
            return Result<LaunchFilter>.Invalid(ResultCodes.Validation, "Ivalid query sort direction");
        }

        if (query.Type == LaunchType.Latest)
        {
            return Result<LaunchFilter>.Success(
                new LaunchFilter(
                    query.Type,
                    0,
                    1,
                    "date_utc",
                    "desc"));
        }

        return Result<LaunchFilter>.Success(
            new LaunchFilter(
                query.Type,
                query.Page,
                query.PageSize,
                sortField,
                sortDirection));
    }

    private static string NormalizeSortField(string? sortField)
    {
        if (string.IsNullOrWhiteSpace(sortField))
        {
            return "date_utc";
        }

        var field = sortField.Trim().ToLowerInvariant();

        switch (field)
        {
            case "flightnumber":
                return "flight_number";
            case "dateutc":
                return "date_utc";
            default:
                return field;
        }
    }

    private static string NormalizeSortDirection(
        LaunchType type,
        string? sortField,
        string? sortDirection)
    {
        if (string.IsNullOrWhiteSpace(sortField))
        {
            return type == LaunchType.Upcoming ? "asc" : "desc";
        }

        if (string.IsNullOrWhiteSpace(sortDirection))
        {
            return "desc";
        }

        return sortDirection.Trim().ToLowerInvariant();
    }
}