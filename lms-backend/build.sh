#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy || echo "Migration failed, but continuing..."

# Build the TypeScript project
echo "Building TypeScript..."
npm run build

echo "Build completed successfully!"