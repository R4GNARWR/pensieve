# Pensieve

A self-hosted family memory journal. Create shared spaces, upload photos, and preserve memories — all on your own server.

## Features

- Multi-user with shared **Spaces** — invite family members by username
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
2. Ask for your username, display name, and password
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

```bash
git pull
docker compose up -d --build
```

## Backup

```bash
docker exec pensieve-db-1 mysqldump -u pensieve -p"$DB_PASSWORD" pensieve_db > backup.sql
```

## Tech Stack

- **Backend**: Node.js · Express · Sequelize · MySQL
- **Frontend**: Nuxt 3 · Vue 3 · Vuetify · Pinia
- **Infra**: Docker Compose · Nginx

## License

MIT
