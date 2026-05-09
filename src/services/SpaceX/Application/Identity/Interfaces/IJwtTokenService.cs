using SpaceX.Application.Identity.Results;
using SpaceX.Domain.User;

namespace SpaceX.Application.Identity.Interfaces;

public interface IJwtTokenService
{
    JwtIssueResult Issue(User user);
}
