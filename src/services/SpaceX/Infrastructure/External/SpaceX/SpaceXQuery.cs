using System.Text.Json.Serialization;

namespace SpaceX.Infrastructure.External.SpaceX;

public class SpaceXQuery
{
    [JsonPropertyName("query")]
    public object Query { get; set; } = null!;

    [JsonPropertyName("options")]
    public object Options { get; set; } = null!;
}
