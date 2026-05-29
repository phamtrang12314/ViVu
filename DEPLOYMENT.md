# ViVuGo Deployment Checklist

Muc tieu: dua backend Spring Boot, web khach hang va web admin len internet voi thay doi toi thieu vao code dang chay.

## Cong viec can lam

1. Chon moi truong deploy.
   - De nhanh va it van hanh: Railway cho backend, Vercel cho `vivugo-client` va `vivugo-admin`, PostgreSQL managed tren Railway/AWS RDS/Supabase.
   - Neu co VPS rieng: dung `docker-compose.prod.yaml`, tro domain qua reverse proxy HTTPS.

2. Chuan bi database production.
   - Tao PostgreSQL database `vivugo_db`.
   - Import schema/data tu `vivugo-backend/src/main/resources/db/vivugo_schema.sql` va seed data neu can.
   - Khong dung password mac dinh `123` cho production.

3. Dat bien moi truong backend.
   - Bat buoc: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET_KEY`, `JWT_CUSTOMER_SECRET_KEY`, `JWT_ADMIN_SECRET_KEY`, `CORS_ALLOWED_ORIGIN_PATTERNS`.
   - Neu dung email/AI: them `MAIL_USERNAME`, `MAIL_PASSWORD`, `AI_API_KEY`, `AI_MODEL`.

4. Dat bien moi truong frontend.
   - Ca `vivugo-client` va `vivugo-admin` can `VITE_API_BASE_URL=https://<backend-domain>/api/`.
   - Bien nay phai co luc build, vi Vite dong no vao file static.

5. Build va kiem tra truoc khi public.
   - Backend: `cd vivugo-backend; .\mvnw.cmd test`
   - Customer app: `cd vivugo-client; npm run build`
   - Admin app: `cd vivugo-admin; npm run build`

6. Deploy.
   - GitLab CI da co `.gitlab-ci.yml` de deploy backend Railway va frontend Vercel neu da khai bao token/project id.
   - VPS co Docker: copy `.env.production.example` thanh `.env.production`, dien gia tri that, sau do chay:

```powershell
docker compose --env-file .env.production -f docker-compose.prod.yaml up -d --build
```

7. Kiem tra sau deploy.
   - Backend health: `https://<backend-domain>/api/health`
   - Customer web mo duoc trang chu va goi API thanh cong.
   - Admin web dang nhap va goi API thanh cong.
   - Browser console khong bi CORS/network error.

## Bien CI/CD can khai bao neu dung GitLab

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

## Bien Railway/backend can khai bao

```text
SERVER_PORT=8081
DB_URL=jdbc:postgresql://<host>:<port>/<database>?sslmode=require
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
JWT_SECRET_KEY=<long-random-secret>
JWT_CUSTOMER_SECRET_KEY=<long-random-secret>
JWT_ADMIN_SECRET_KEY=<long-random-secret>
CORS_ALLOWED_ORIGIN_PATTERNS=https://<client-domain>,https://<admin-domain>
MAIL_USERNAME=<gmail-address>
MAIL_PASSWORD=<gmail-app-password>
AI_API_KEY=<ai-api-key>
AI_MODEL=openai/gpt-4o-mini
```

## File da them cho deploy

- `.env.production.example`: mau bien moi truong production, khong chua secret that.
- `docker-compose.prod.yaml`: chay 3 service production bang Docker voi managed PostgreSQL.
- `.dockerignore` trong tung app: giam kich thuoc build context, tranh copy env/log/build output vao image.
- Dockerfile frontend nhan `VITE_API_BASE_URL` luc build.

## Ghi chu an toan

- Chua the public that neu thieu token Railway/Vercel, domain va secret database/JWT/mail.
- Khong commit `.env.production`, password database, app password Gmail hoac API key.
- Sau khi schema on dinh, nen doi `HIBERNATE_DDL_AUTO=validate` de tranh Hibernate tu sua schema production.
