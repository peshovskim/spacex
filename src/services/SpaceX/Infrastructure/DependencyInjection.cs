using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpaceX.Application.Common.Abstractions;
using SpaceX.Application.Identity.Interfaces;
using SpaceX.Application.Identity.Repositories;
using SpaceX.Infrastructure.Options;
using SpaceX.Infrastructure.Persistence;
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
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is missing or empty.");
        }

        services.AddOptions<DatabaseOptions>()
            .Configure<IConfiguration>((options, config) =>
            {
                options.ConnectionString =
                    config.GetConnectionString("DefaultConnection") ?? string.Empty;
            });

        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection("Jwt"))
            .Validate(
                options =>
                {
                    if (string.IsNullOrWhiteSpace(options.Issuer)
                        || string.IsNullOrWhiteSpace(options.Audience))
                    {
                        return false;
                    }

                    if (!options.IsSecretKeyStrongEnough())
                    {
                        return false;
                    }

                    return options.ExpiresMinutes > 0;
                },
                "Jwt options validation failed.")
            .ValidateOnStart();

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddEfUnitOfWork<AppDbContext>();

        return services;
    }

    public static IServiceCollection AddEfUnitOfWork<TDbContext>(this IServiceCollection services)
        where TDbContext : DbContext
    {
        services.AddScoped<IUnitOfWork, EfUnitOfWork<TDbContext>>();
        return services;
    }
}
