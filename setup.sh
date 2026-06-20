#!/bin/bash
set -e

if [ -f .env ]; then
  echo ".env already exists. Remove it before running setup again."
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo "Docker not found. Install Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

# Generate secrets
SECRET_KEY=$(openssl rand -hex 64)
REFRESH_SECRET_KEY=$(openssl rand -hex 64)
DB_PASSWORD=$(openssl rand -hex 16)
MYSQL_ROOT_PASSWORD=$(openssl rand -hex 16)

echo "Setup..."
echo ""

read -p "Username (letters, digits, _ and - only): " ADMIN_USERNAME
read -p "Display name: " ADMIN_NAME

while true; do
  read -s -p "Password (min 8 characters): " ADMIN_PASSWORD
  echo
  if [ ${#ADMIN_PASSWORD} -ge 8 ]; then
    break
  fi
  echo "Password too short, try again."
done

# Write .env
cat > .env <<EOF
DB_PASSWORD=$DB_PASSWORD
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
SECRET_KEY=$SECRET_KEY
REFRESH_SECRET_KEY=$REFRESH_SECRET_KEY
ALLOW_REGISTRATION=true
CORS_ORIGIN=http://localhost
EOF

echo ""
echo "Secrets generated"
echo "Starting Pensieve (first build may take a few minutes)..."
docker compose up -d --build

# Wait for server (up to 2 minutes)
echo "Waiting for server..."
for i in $(seq 1 24); do
  if curl -sf http://localhost/health > /dev/null 2>&1; then
    echo "Server is ready."
    break
  fi
  if [ "$i" -eq 24 ]; then
    echo "Server did not respond in 2 minutes."
    echo "Register manually at http://localhost"
    exit 0
  fi
  sleep 5
done

# Register first user
echo "Creating first user..."
HTTP_STATUS=$(curl -s -o /tmp/pensieve_register.json -w "%{http_code}" \
  -X POST http://localhost/api/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"name\":\"$ADMIN_NAME\",\"password\":\"$ADMIN_PASSWORD\"}")

rm -f /tmp/pensieve_register.json

if [ "$HTTP_STATUS" = "201" ]; then
  echo ""
  echo "Done! Pensieve is running at http://localhost"
  echo "Username: $ADMIN_USERNAME"
else
  echo "App is running but user creation failed (HTTP $HTTP_STATUS)."
  echo "Register manually at http://localhost"
fi
