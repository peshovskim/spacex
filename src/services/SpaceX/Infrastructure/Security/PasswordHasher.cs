using System.Security.Cryptography;
using SpaceX.Application.Security;

namespace SpaceX.Infrastructure.Security;

public sealed class PasswordHasher : IPasswordHasher
{
    private const int Iterations = 100_000;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    public (byte[] Hash, byte[] Salt) HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Password cannot be null or empty.", nameof(password));
        }

        var salt = RandomNumberGenerator.GetBytes(SaltSize);

        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize);

        return (hash, salt);
    }

    public bool VerifyPassword(string password, byte[] hash, byte[] salt)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Pasword cannot be null or empty.", nameof(password));
        }

        if (hash is null)
        {
            throw new ArgumentNullException(nameof(hash));
        }

        if (salt is null)
        {
            throw new ArgumentNullException(nameof(salt));
        }

        var computed = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            hash.Length);

        return computed.SequenceEqual(hash);
    }
}
