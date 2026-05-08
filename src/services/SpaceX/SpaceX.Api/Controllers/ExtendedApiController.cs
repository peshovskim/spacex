using System.Net;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;

namespace SpaceX.Api.Controllers;

public abstract class ExtendedApiController : ControllerBase
{
    protected static HttpStatusCode GetStatusCode(ResultType resultType)
    {
        return resultType switch
        {
            ResultType.NotFound => HttpStatusCode.NotFound,
            ResultType.Forbidden => HttpStatusCode.Forbidden,
            ResultType.Conflicted => HttpStatusCode.Conflict,
            ResultType.Invalid => HttpStatusCode.BadRequest,
            ResultType.Unauthorized => HttpStatusCode.Unauthorized,
            _ => HttpStatusCode.InternalServerError,
        };
    }

    protected IActionResult OkOrError<T>(Result<T> result)
    {
        IActionResult? errorResponse = GetErrorResponse(result);

        if (errorResponse is not null)
        {
            return errorResponse;
        }

        return Ok(result.Value);
    }

    protected IActionResult OkOrError(Result result)
    {
        IActionResult? errorResponse = GetErrorResponse(result);

        if (errorResponse is not null)
        {
            return errorResponse;
        }

        return Ok();
    }

    private IActionResult? GetErrorResponse(Result result)
    {
        if (result.IsFailure)
        {
            ResultError error = result.Error!;
            HttpStatusCode statusCode = GetStatusCode(error.Type);

            return new ObjectResult(new { code = error.Code, message = error.Message })
            {
                StatusCode = (int)statusCode,
            };
        }

        return null;
    }
}
