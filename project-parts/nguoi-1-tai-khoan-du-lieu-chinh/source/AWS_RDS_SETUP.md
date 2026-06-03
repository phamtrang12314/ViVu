# ViVuGo AWS RDS PostgreSQL Setup

Backend uses AWS database settings from environment variables by default.

Current AWS dev database created for this project:

- Engine: PostgreSQL
- RDS instance: `vivugo-postgres`
- Database: `vivugo_db`
- Endpoint: `vivugo-postgres.c56osgig0ftk.ap-southeast-1.rds.amazonaws.com`

Keep the RDS password private. Do not commit it into source code.

## AWS run

Fill `vivugo-backend/.env` with the real AWS RDS and service credentials:

```powershell
cd .\vivugo-backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

## Import seed data

Use `psql` with the AWS RDS connection string:

```powershell
cd .\vivugo-backend
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "host=vivugo-postgres.c56osgig0ftk.ap-southeast-1.rds.amazonaws.com port=5432 dbname=vivugo_db user=postgres sslmode=require" -f ".\src\main\resources\TripBeeData.sql"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "host=vivugo-postgres.c56osgig0ftk.ap-southeast-1.rds.amazonaws.com port=5432 dbname=vivugo_db user=postgres sslmode=require" -f ".\src\main\resources\db\add_100_sample_tours.sql"
```


