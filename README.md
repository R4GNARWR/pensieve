# Pensieve

A self-hosted family memory journal. Create shared spaces, upload photos, and preserve memories — all on your own server.

## Features

- Multi-user with shared **Spaces** — invite family members by email
- Photo uploads with automatic resizing
- Browse memories by year
- Fully self-hosted — no cloud services, no subscriptions

## Requirements

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

```bash
# 1. Copy the example env file
cp .env.example .env

# 2. Edit .env — set your own passwords and secrets
#    Generate JWT secrets with:  openssl rand -hex 64
nano .env

# 3. Build and start
docker compose up -d --build

# 4. Open in browser
open http://localhost
```

Register the first account, then set `ALLOW_REGISTRATION=false` in `.env` and restart (`docker compose up -d`) to close public registration.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_PASSWORD` | MySQL user password | — |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | — |
| `SECRET_KEY` | JWT access token secret | — |
| `REFRESH_SECRET_KEY` | JWT refresh token secret | — |
| `ALLOW_REGISTRATION` | Allow new user sign-ups | `true` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost` |

## Adding Family Members

1. Each person registers their own account (while `ALLOW_REGISTRATION=true`)
2. Go to **Spaces** → create or open a space → **Add member** → enter their email
3. Close registration when everyone is set up: set `ALLOW_REGISTRATION=false` in `.env`, then `docker compose up -d`

## Updating

```bash
git pull
docker compose up -d --build
```

## Data

- Photos: stored in a Docker volume (`mysql_data`) and inside the backend container under `uploads/`
- Database: MySQL 8.0 in a named volume `mysql_data`

To back up:
```bash
docker exec pensieve-db-1 mysqldump -u pensieve -p"$DB_PASSWORD" pensieve_db > backup.sql
```

## Tech Stack

- **Backend**: Node.js · Express · Sequelize · MySQL
- **Frontend**: Nuxt 3 · Vue 3 · Vuetify · Pinia
- **Infra**: Docker Compose · Nginx

## License

MIT
