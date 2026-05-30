$env:SPRING_PROFILES_ACTIVE = "aws"
$env:DB_URL = "jdbc:postgresql://your-rds-endpoint.ap-southeast-1.rds.amazonaws.com:5432/vivugo_db?sslmode=require"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "replace-with-your-rds-password"

$env:SPRING_DATASOURCE_URL = $env:DB_URL
$env:SPRING_DATASOURCE_USERNAME = $env:DB_USERNAME
$env:SPRING_DATASOURCE_PASSWORD = $env:DB_PASSWORD

$env:CORS_ALLOWED_ORIGIN_PATTERNS = "http://localhost:*,http://127.0.0.1:*"
$env:ASSET_FALLBACK_BASE_URL = "http://localhost:5173"

# Optional: lets local backend poll SePay transactions when SePay cannot call localhost webhook directly.
$env:SEPAY_API_TOKEN = ""
$env:SEPAY_ACCOUNT_NUMBER = ""

