using System.Text.Json.Serialization;

namespace SpaceX.Application.Launches.Responses;

public sealed class LaunchReadModel
{
    [JsonPropertyName("flight_number")]
    public int FlightNumber { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Details { get; set; }

    [JsonPropertyName("date_utc")]
    public DateTimeOffset? DateUtc { get; init; }

    public bool? Upcoming { get; init; }

    public bool? Success { get; init; }
}
