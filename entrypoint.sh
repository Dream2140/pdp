#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  node node_modules/prisma/build/index.js migrate deploy || echo "Migration skipped (no database available)"
fi

echo "Starting application..."
exec node server.js
