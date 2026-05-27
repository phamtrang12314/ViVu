# Security Notes

## Secrets

Never commit real credentials, API keys, JWT secrets, database passwords, mail app passwords, or production configuration files.

Ignored local files include:

- `.env`
- `.env.*`
- `application.properties`
- `application-local.properties`
- `*.log`
- `uploads/`

Use the committed example files as templates and keep the real values on your local machine or in the deployment platform secret manager.

## Local Defaults

Some development examples use simple placeholder passwords such as `123`. These values are only for local development and must be changed before deployment.

## Reporting Issues

If a secret is accidentally committed, rotate that secret immediately and remove it from the repository history before sharing the repository further.
