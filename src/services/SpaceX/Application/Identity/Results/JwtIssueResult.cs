namespace SpaceX.Application.Identity.Results;

public sealed record JwtIssueResult
{
    public string AccessToken { get; set; }

    public DateTime ExpiresAtUtc { get; set; }

    public JwtIssueResult(string accessToken, DateTime expiresAtUtc)
    {
        AccessToken = accessToken;
        ExpiresAtUtc = expiresAtUtc;
    }
}