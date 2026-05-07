using MediatR;
using SpaceX.Application.Identity.Repositories;
using SpaceX.Application.Identity.Requests;
using SpaceX.Application.Security;
using SpaceX.Domain.Entities;
using SharedKernel;
using SharedKernel.Cqrs;

namespace SpaceX.Application.Identity.Commands;

public sealed record LoginUserCommand(LoginUserRequest Request) : ICommand<Result>;

public sealed class LoginUserCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher)
    : IRequestHandler<LoginUserCommand, Result>
{
    public async Task<Result> Handle(LoginUserCommand command, CancellationToken cancellationToken)
    {
        LoginUserRequest request = command.Request;

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Result.Invalid(ResultCodes.Validation, "Email and password are required.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        User? user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (user is null)
        {
            return Result.Unauthorized(ResultCodes.Unauthorized, "Invalid email or password.");
        }

        if (!passwordHasher.VerifyPassword(request.Password, user.PasswordHash, user.Salt))
        {
            return Result.Unauthorized(ResultCodes.Unauthorized, "Invalid email or password.");
        }

        return Result.Success();
    }
}
