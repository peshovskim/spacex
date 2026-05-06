using Microsoft.Extensions.DependencyInjection;

namespace SpaceX.Application;

/// <summary>
/// Registers Application layer services
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services;
    }
}
