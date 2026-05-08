using SpaceX.Application.Identity;
using SpaceX.Domain.Entities;

namespace SpaceX.Application.Identity.Interfaces;

public interface IJwtTokenService
{
    JwtIssueResult Issue(User user);
}
