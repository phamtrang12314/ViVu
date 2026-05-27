# Contributing

## Branching

Use short branch names that describe the change:

```text
feature/tour-filter
fix/booking-status
docs/setup-guide
```

## Before Committing

Run the relevant checks for the area you changed:

```powershell
cd vivugo-client
npm run lint
npm run build

cd ../vivugo-admin
npm run lint
npm run build

cd ../vivugo-backend
.\mvnw test
```

## Commit Style

Keep commits focused. Good examples:

```text
Add booking history view
Fix tour image fallback
Document backend environment setup
```

Avoid committing generated folders such as `node_modules`, `dist`, `target`, logs, local uploads, or real secrets.
