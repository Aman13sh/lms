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

# Create a startup script
RUN echo '#!/bin/sh\n\
echo "Running database migrations..."\n\
npx prisma migrate deploy\n\
if [ $? -eq 0 ]; then\n\
  echo "Migrations completed successfully"\n\
  # Check if database has been seeded (check if any users exist)\n\
  echo "Checking if database needs seeding..."\n\
  npx prisma db seed || echo "Seeding skipped or failed (possibly data already exists)"\n\
else\n\
  echo "Migration failed, continuing anyway..."\n\
fi\n\
echo "Starting server..."\n\
node dist/server.js' > /app/start.sh && chmod +x /app/start.sh

# Expose port
EXPOSE 5001

# Start the application with migrations
CMD ["/app/start.sh"]