# Pensieve

A self-hosted family memory journal. Create shared spaces, upload photos, and preserve memories — all on your own server.

## Features

- Multi-user with shared **Spaces** — add family members from the user list
- Photo uploads with automatic resizing
- Browse memories by year
- Fully self-hosted — no cloud services, no subscriptions

## Requirements

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- `openssl` (pre-installed on macOS and Linux)

## Quick Start

```bash
chmod +x setup.sh && ./setup.sh
```

The script will:
1. Generate all secrets automatically
2. Ask for your email, display name, and password
3. Build and start the app
4. Create your first account

Then open **http://localhost**.

## Adding Family Members

1. Set `ALLOW_REGISTRATION=true` in `.env`, then `docker compose up -d`
2. Each person opens the app and registers
3. Go to **Menu → Add user** to add them to a Space
4. Optionally set `ALLOW_REGISTRATION=false` again when done

## Environment Variables

All variables live in `.env` (created by `setup.sh`).

| Variable | Description |
|---|---|
| `DB_PASSWORD` | MySQL user password |
| `MYSQL_ROOT_PASSWORD` | MySQL root password |
| `SECRET_KEY` | JWT access token secret |
| `REFRESH_SECRET_KEY` | JWT refresh token secret |
| `ALLOW_REGISTRATION` | Allow new user sign-ups (`true` / `false`) |
| `CORS_ORIGIN` | Allowed CORS origin (default: `http://localhost`) |

## Updating

Create a backup before updating. Then build the backend, stop the old application, apply pending migrations, and start the new version:

```bash
git pull
docker compose build backend frontend
docker compose stop backend
docker compose run --rm backend npm run migrate
docker compose up -d
```

To inspect migration status or roll back the latest reversible migration:

```bash
docker compose run --rm backend npm run migrate:status
docker compose run --rm backend npm run migrate:down
```

The initial-schema migration is intentionally irreversible because it also acts as a baseline for existing databases. Do not use migration rollback to rebuild a local database; use a separate clean database instead.

The `refresh.userId` migration deletes existing refresh tokens. Users will need to sign in again after this update; access tokens remain valid until they expire.

The email login migration requires an empty `user` table. Register new accounts through the updated app after applying
it.

## Backup

```bash
docker compose exec db mysqldump -u pensieve -p"$DB_PASSWORD" pensieve_db > backup.sql
```

## Tech Stack

- **Backend**: Node.js · TypeScript · Express · Sequelize · MySQL
- **Frontend**: Nuxt 3 · Vue 3 · Vuetify · Pinia
- **Infra**: Docker Compose · Nginx

## License

MIT
