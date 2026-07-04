#!/bin/sh
set -e

echo "Starting AlignHR backend..."

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is missing"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "JWT_SECRET is missing"
  exit 1
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
node dist/server.js
