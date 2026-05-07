using System.ComponentModel.DataAnnotations;

namespace SpaceX.Application.Identity.Requests;

public sealed class LoginUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
