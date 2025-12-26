# Production Dockerfile for Node.js Backend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy everything first
COPY . .

# Install all dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 5001

# Start the application
CMD ["node", "dist/server.js"]