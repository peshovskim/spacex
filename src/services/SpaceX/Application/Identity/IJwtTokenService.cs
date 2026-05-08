using SpaceX.Domain.Entities;

namespace SpaceX.Application.Identity;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
