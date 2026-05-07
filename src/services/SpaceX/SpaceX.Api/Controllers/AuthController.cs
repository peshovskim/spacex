using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaceX.Application.Identity.Commands;
using SpaceX.Application.Identity.Requests;
using SharedKernel;

namespace SpaceX.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IMediator mediator) : ExtendedApiController
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserRequest request,
        CancellationToken cancellationToken)
    {
        Result result = await mediator.Send(new RegisterUserCommand(request), cancellationToken);

        return OkOrError(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginUserRequest request,
        CancellationToken cancellationToken)
    {
        Result result = await mediator.Send(new LoginUserCommand(request), cancellationToken);

        return OkOrError(result);
    }
}
