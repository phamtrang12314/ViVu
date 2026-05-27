$env:SPRING_PROFILES_ACTIVE = "aws"
$env:DB_URL = "jdbc:postgresql://your-rds-endpoint.ap-southeast-1.rds.amazonaws.com:5432/vivugo_db?sslmode=require"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "replace-with-your-rds-password"

$env:JWT_SECRET_KEY = "replace-with-a-long-random-secret"
$env:JWT_CUSTOMER_SECRET_KEY = "replace-with-a-long-random-customer-secret"
$env:JWT_ADMIN_SECRET_KEY = "replace-with-a-long-random-admin-secret"

$env:MAIL_HOST = "smtp.gmail.com"
$env:MAIL_PORT = "587"
$env:MAIL_USERNAME = "your-gmail@gmail.com"
$env:MAIL_PASSWORD = "your-16-character-gmail-app-password"
