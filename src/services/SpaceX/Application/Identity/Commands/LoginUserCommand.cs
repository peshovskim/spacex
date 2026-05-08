using MediatR;
using SpaceX.Application.Identity.Repositories;
using SpaceX.Application.Identity.Requests;
using SpaceX.Application.Identity.Responses;
using SpaceX.Application.Identity.Interfaces;
using SpaceX.Domain.Entities;
using SharedKernel;
using SharedKernel.Cqrs;
using SpaceX.Application.Identity.Results;

namespace SpaceX.Application.Identity.Commands;

public sealed record LoginUserCommand(LoginUserRequest Request) : ICommand<Result<LoginResponse>>;

public sealed class LoginUserCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService)
    : IRequestHandler<LoginUserCommand, Result<LoginResponse>>
{
    public async Task<Result<LoginResponse>> Handle(LoginUserCommand command, CancellationToken cancellationToken)
    {
        LoginUserRequest request = command.Request;

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Result<LoginResponse>.Invalid(ResultCodes.Validation, "Email and password are required.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        User? user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (user is null)
        {
            return Result<LoginResponse>.Unauthorized(ResultCodes.Unauthorized, "Invalid email or password.");
        }

        if (!passwordHasher.VerifyPassword(request.Password, user.PasswordHash, user.Salt))
        {
            return Result<LoginResponse>.Unauthorized(ResultCodes.Unauthorized, "Invalid email or password.");
        }

        JwtIssueResult issued = jwtTokenService.Issue(user);

        return Result<LoginResponse>.Success(
            new LoginResponse
            {
                AccessToken = issued.AccessToken,
                ExpiresAtUtc = issued.ExpiresAtUtc,
                Email = user.Email,
                UserId = user.Id,
            });
    }
}
