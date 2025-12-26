# Production Dockerfile for Node.js Backend
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript - this creates the dist folder
RUN npm run build

# List contents to verify build (for debugging)
RUN ls -la dist/utils/ || echo "dist/utils not found"

# Clean up dev dependencies
RUN npm prune --production

# Create a startup script with proper formatting
RUN cat > /app/start.sh << 'EOF'
#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
  echo "Migrations completed successfully"
  echo "Checking if database needs seeding..."
  npx prisma db seed || echo "Seeding skipped or failed (possibly data already exists)"
else
  echo "Migration failed, continuing anyway..."
fi
echo "Starting server..."
exec node dist/server.js
EOF

# Make the script executable
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 5001

# Start the application with migrations
CMD ["/bin/sh", "/app/start.sh"]