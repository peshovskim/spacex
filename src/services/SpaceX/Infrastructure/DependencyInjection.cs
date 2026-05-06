using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpaceX.Infrastructure.Options;

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

        return services;
    }
}
