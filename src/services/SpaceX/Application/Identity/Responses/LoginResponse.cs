namespace SpaceX.Application.Identity.Responses;

public sealed class LoginResponse
{
    public required string AccessToken { get; init; }

    public required DateTime ExpiresAtUtc { get; init; }

    public required string Email { get; init; }

    public required int UserId { get; init; }
}
