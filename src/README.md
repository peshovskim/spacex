# SpaceX (src)

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (npm)
- **SQL Server LocalDB** (matches the default API connection string)
- **Redis** — only if `Caching:UseRedis` is `true` in the API `appsettings` (see `services/SpaceX/docker-compose.yml`)

## Run the API

From this folder (`src`):

```bash
dotnet run --project services/SpaceX/SpaceX.Api/SpaceX.Api.csproj
```

HTTPS profile listens on **https://localhost:7263** (see `launchSettings.json`). Swagger opens in the browser when using the `https` profile.

Use `appsettings.Development.json` / user secrets for local **Jwt** and **database** values if the defaults are not enough.

## Run the web app

```bash
cd clients/spcex-web
npm install
npm start
```

The dev app expects the API at **https://localhost:7263** (`environment.development.ts`).

## Redis (optional)

From `services/SpaceX`:

```bash
docker compose up -d
```

Set `ConnectionStrings:Redis` to `localhost:6379` or turn off distributed cache reads with `"Caching": { "UseRedis": false }` in the API config.
