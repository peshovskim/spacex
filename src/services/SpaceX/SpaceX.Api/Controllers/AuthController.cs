using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaceX.Application.Identity.Commands;
using SpaceX.Application.Identity.Requests;

namespace SpaceX.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserRequest request,
        CancellationToken cancellationToken)
    {
        await mediator.Send(new RegisterUserCommand(request), cancellationToken);

        return Ok();
    }
}
