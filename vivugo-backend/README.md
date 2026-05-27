# ViVuGo Backend

Spring Boot API for ViVuGo. It provides authentication, tour data, booking workflows, payment webhook handling, review management, contact messages, admin APIs, mail notifications, and AI chat integration.

## Tech Stack

- Java 17
- Spring Boot
- Spring Security and JWT
- Spring Data JPA
- PostgreSQL
- Redis
- Maven Wrapper

## Local Development

Copy the example config before running locally:

```powershell
Copy-Item src/main/resources/application.properties.example src/main/resources/application.properties
Copy-Item src/main/resources/application-local.properties.example src/main/resources/application-local.properties
```

Then update the local values if needed and start the API:

```powershell
.\mvnw spring-boot:run
```

The API runs on <http://localhost:8081/api/>.

## Useful Commands

```powershell
.\mvnw test
.\mvnw clean package
```
