# spacex

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (npm)
- **SQL Server LocalDB** (matches the default API connection string)
- **Redis** — only if `Caching:UseRedis` is `true` in the API `appsettings` (see `src/services/SpaceX/docker-compose.yml`)

## Run the API

From the repository root:

```bash
dotnet run --project src/services/SpaceX/SpaceX.Api/SpaceX.Api.csproj
```

HTTPS profile listens on **https://localhost:7263** (`launchSettings.json`). Swagger opens when using the `https` profile.

Use `appsettings.Development.json` / user secrets for local **Jwt** and **database** if needed.

## Run the web app

```bash
cd src/clients/spcex-web
npm install
npm start
```

The dev app expects the API at **https://localhost:7263** (`environment.development.ts`).

## Redis (optional)

```bash
cd src/services/SpaceX
docker compose up -d
```

Use `ConnectionStrings:Redis` `localhost:6379`, or set `"Caching": { "UseRedis": false }` in the API config to skip cache reads.
