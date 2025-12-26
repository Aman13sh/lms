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

# Expose port
EXPOSE 5001

# Start the application
CMD ["node", "dist/server.js"]