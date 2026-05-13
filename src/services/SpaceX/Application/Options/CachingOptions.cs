namespace SpaceX.Application.Options;

public sealed class CachingOptions
{
    public const string SectionName = "Caching";

    public bool UseRedis { get; set; }
}
