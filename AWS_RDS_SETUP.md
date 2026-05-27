# ViVuGo AWS RDS PostgreSQL Setup

Backend now uses AWS database settings from environment variables by default.

Current AWS dev database created for this project:

- Region: `ap-southeast-1`
- RDS instance: `vivugo-postgres`
- Database: `vivugo_db`
- Endpoint: `vivugo-postgres.c56osgig0ftk.ap-southeast-1.rds.amazonaws.com`
- Port: `5432`
- Security group: `sg-09afc6479268885ee`

## 1. Create AWS RDS PostgreSQL

Create a PostgreSQL RDS instance with:

- Engine: PostgreSQL
- DB name: `vivugo_db`
- Port: `5432`
- Master username: for example `postgres`
- Public access: `Yes` for local development only
- Security group inbound rule: PostgreSQL TCP `5432` from your current IP

Keep the RDS password private. Do not commit it into source code.

## 2. Set environment variables in PowerShell

Copy the example file and fill in your real RDS endpoint/password:

```powershell
cd "D:\HK2 2025-2026\KienTrucPhanMem\ViVuGo\vivugo-backend"
notepad .\aws-env.example.ps1
```

Then load it in the same PowerShell window:

```powershell
.\aws-env.example.ps1
```

The important variables are:

```powershell
$env:SPRING_PROFILES_ACTIVE = "aws"
$env:DB_URL = "jdbc:postgresql://your-rds-endpoint.ap-southeast-1.rds.amazonaws.com:5432/vivugo_db?sslmode=require"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "your-rds-password"
```

## 3. Create schema and import sample data

The app entities are the source of truth for the current schema. Run the backend tests once so Hibernate creates the schema on RDS:

```powershell
.\aws-env.local.ps1
.\mvnw.cmd test
```

Then import seed data:

```powershell
$env:PGPASSWORD = $env:DB_PASSWORD
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "host=vivugo-postgres.c56osgig0ftk.ap-southeast-1.rds.amazonaws.com port=5432 dbname=vivugo_db user=postgres sslmode=require" -f ".\src\main\resources\TripBeeData.sql"
```

## 4. Run backend

```powershell
.\aws-env.local.ps1
.\mvnw.cmd spring-boot:run
```

Backend should run at:

```text
http://localhost:8081
```

## Optional local fallback

If you need the old local PostgreSQL mode:

```powershell
$env:SPRING_PROFILES_ACTIVE = "local"
.\mvnw.cmd spring-boot:run
```
