using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceX.Application.Missions.Queries.GetMissions;
using SpaceX.Application.Missions.Responses;
using SharedKernel;

namespace SpaceX.Api.Controllers;

[ApiController]
[Route("api/missions")]
[Authorize]
public sealed class MissionsController(IMediator mediator) : ExtendedApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedLaunchesReadModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetMissions([FromQuery] GetMissionsQuery query, CancellationToken cancellationToken)
    {
        Result<PaginatedLaunchesReadModel> result =
            await mediator.Send(query, cancellationToken).ConfigureAwait(false);

        return OkOrError(result);
    }
}
