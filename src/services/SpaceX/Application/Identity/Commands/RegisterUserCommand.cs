using MediatR;
using SpaceX.Application.Identity.Requests;
using SpaceX.Application.Security;

namespace SpaceX.Application.Identity.Commands;

public sealed record RegisterUserCommand(RegisterUserRequest Request) : IRequest;

public sealed class RegisterUserCommandHandler(IPasswordHasher passwordHasher)
    : IRequestHandler<RegisterUserCommand>
{
    public Task Handle(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        passwordHasher.HashPassword(command.Request.Password);

        return Task.CompletedTask;
    }
}
