namespace SpaceX.Infrastructure.Options;

public sealed class SpaceXApiOptions
{
    public const string SectionName = "SpaceXApi";

    public string BaseUrl { get; set; } = string.Empty;
}
