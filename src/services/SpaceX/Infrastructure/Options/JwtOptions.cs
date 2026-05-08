using System.Text;

namespace SpaceX.Infrastructure.Options;

public sealed class JwtOptions
{
    public string Issuer { get; set; } = string.Empty;

    public string Audience { get; set; } = string.Empty;

    public string SecretKey { get; set; } = string.Empty;

    public int ExpiresMinutes { get; set; }

    public bool IsSecretKeyStrongEnough() =>
        !string.IsNullOrWhiteSpace(SecretKey)
        && Encoding.UTF8.GetByteCount(SecretKey) >= 32;
}
