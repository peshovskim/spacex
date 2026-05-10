using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaceX.Application.Launches.Queries.GetLaunches;
using SpaceX.Application.Launches.Responses;
using SharedKernel;

namespace SpaceX.Api.Controllers;

[ApiController]
[Route("api/launches")]
public sealed class LaunchesController(IMediator mediator) : ExtendedApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(LaunchesReadModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetLaunches([FromQuery] GetLaunchesQuery query, CancellationToken cancellationToken)
    {
        Result<LaunchesReadModel> result =
            await mediator.Send(query, cancellationToken);

        return OkOrError(result);
    }
}
