# ViVuGo

ViVuGo is a travel tour booking project with a Spring Boot backend, a customer web app, and an admin dashboard.

## Project Structure

```text
ViVuGo/
├── vivugo-backend/   # Spring Boot API, PostgreSQL, Redis, mail, AI chat
├── vivugo-client/    # Customer-facing React + Vite app
├── vivugo-admin/     # Admin React + Vite dashboard
├── docker-compose.yaml
└── .github/workflows/
```

## Requirements

- Java 17+
- Node.js 20+
- Docker Desktop
- PostgreSQL 16 and Redis 7 if running without Docker

## Run With Docker

```powershell
docker compose up --build
```

Default local URLs:

- Customer app: <http://localhost:5173>
- Admin app: <http://localhost:5174>
- Backend API: <http://localhost:8081/api>
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Run Locally

Backend:

```powershell
cd vivugo-backend
.\mvnw spring-boot:run
```

Customer app:

```powershell
cd vivugo-client
npm install
npm run dev
```

Admin app:

```powershell
cd vivugo-admin
npm install
npm run dev
```

## Useful Commands

```powershell
# Frontend checks
cd vivugo-client; npm run lint; npm run build
cd ../vivugo-admin; npm run lint; npm run build

# Backend checks
cd ../vivugo-backend; .\mvnw test
```

## Environment Notes

Do not commit real secrets. Local config files such as `.env`, `application.properties`, `application-local.properties`, logs, build output, and dependency folders are ignored by Git.

Use the example files in this repo as templates, then fill in your own database, mail, JWT, and AI credentials locally.
