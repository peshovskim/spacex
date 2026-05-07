using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpaceX.Application.Identity.Repositories;
using SpaceX.Application.Security;
using SpaceX.Infrastructure.Options;
using SpaceX.Infrastructure.Persistence.Repositories;
using SpaceX.Infrastructure.Security;

namespace SpaceX.Infrastructure;

/// <summary>
/// Registers Infrastructure layer services
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddOptions<DatabaseOptions>()
            .Configure<IConfiguration>((options, config) =>
            {
                options.ConnectionString =
                    config.GetConnectionString("DefaultConnection") ?? string.Empty;
            });

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
