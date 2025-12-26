# Makefile for LMS Docker Services

.PHONY: help build up down logs shell clean dev prod migrate seed test

# Default target
help:
	@echo "Available commands:"
	@echo "  make build       - Build all Docker images"
	@echo "  make up          - Start all services in production mode"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make shell       - Open shell in backend container"
	@echo "  make clean       - Clean up volumes and containers"
	@echo "  make dev         - Start services in development mode"
	@echo "  make prod        - Start services in production mode"
	@echo "  make migrate     - Run database migrations"
	@echo "  make seed        - Seed the database"
	@echo "  make test        - Run tests"
	@echo "  make ps          - Show running containers"
	@echo "  make restart     - Restart all services"

# Build all Docker images
build:
	docker-compose build

# Start services in production mode
up:
	docker-compose up -d

# Start services in development mode with hot reload
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start services in production mode (detached)
prod:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs from all services
logs:
	docker-compose logs -f

# View logs from specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-postgres:
	docker-compose logs -f postgres

# Open shell in backend container
shell:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-postgres:
	docker-compose exec postgres psql -U lmsuser -d lmsdb

# Clean up volumes and containers
clean:
	docker-compose down -v
	docker system prune -f

# Run database migrations
migrate:
	docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
generate:
	docker-compose exec backend npx prisma generate

# Seed the database
seed:
	docker-compose exec backend npm run seed

# Run tests
test:
	docker-compose exec backend npm test

# Show running containers
ps:
	docker-compose ps

# Restart all services
restart:
	docker-compose restart

# Restart specific service
restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

# Build and start in one command
up-build:
	docker-compose up --build -d

# Development with rebuild
dev-build:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Backup database
backup-db:
	@echo "Creating database backup..."
	@mkdir -p backups
	@docker-compose exec postgres pg_dump -U lmsuser lmsdb > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/ directory"

# Restore database from backup
restore-db:
	@echo "Available backups:"
	@ls -la backups/*.sql
	@echo "To restore, run: docker-compose exec -T postgres psql -U lmsuser lmsdb < backups/[backup_file.sql]"