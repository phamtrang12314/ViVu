# ViVuGo GitLab CI/CD and Internet Deployment

This project is prepared for GitLab CI/CD with:

- Spring Boot backend deployed to Railway.
- Customer React app deployed to Vercel.
- Admin React app deployed to Vercel.
- PostgreSQL hosted by Railway, AWS RDS, Supabase, or another managed provider.

## GitLab CI/CD Variables

Add these in `Settings > CI/CD > Variables`.

```text
RAILWAY_TOKEN
RAILWAY_BACKEND_SERVICE
RAILWAY_BACKEND_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_CLIENT_PROJECT_ID
VERCEL_ADMIN_PROJECT_ID
VITE_API_BASE_URL
VITE_CLIENT_URL
VITE_ADMIN_URL
```

`VITE_API_BASE_URL` should be the online backend API URL, for example:

```text
https://vivugo-backend.up.railway.app/api/
```

## Railway Backend Variables

Set these on the Railway backend service:

```text
SERVER_PORT=8081
DB_URL=jdbc:postgresql://<host>:<port>/<database>?sslmode=require
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
JWT_SECRET_KEY=<long-random-secret>
JWT_CUSTOMER_SECRET_KEY=<long-random-secret>
JWT_ADMIN_SECRET_KEY=<long-random-secret>
CORS_ALLOWED_ORIGIN_PATTERNS=https://<client-domain>,https://<admin-domain>,http://localhost:*
MAIL_USERNAME=<gmail-address>
MAIL_PASSWORD=<gmail-app-password>
AI_API_KEY=<ai-api-key>
```

## Grading Evidence

- GitLab repository link.
- Green GitLab pipeline screenshot.
- Backend health URL: `/api/health`.
- Customer app URL.
- Admin app URL.
- Railway and Vercel deployment screenshots.
