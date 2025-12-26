# Docker Setup for LMS Application

This document provides instructions for running the LMS application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)

## Quick Start

### 1. Clone the repository and navigate to the project root
```bash
cd /Users/amansharma/1fi
```

### 2. Copy the environment configuration
```bash
cp .env.example .env
```

### 3. Update the `.env` file with your configurations
Edit the `.env` file and update the following critical values:
- Database passwords
- JWT secrets
- Encryption keys
- Email configuration
- AWS credentials (if using S3)
- Payment gateway credentials

### 4. Build and start all services

#### Using Make (recommended):
```bash
# Production mode
make up-build

# Development mode with hot reload
make dev-build
```

#### Using Docker Compose directly:
```bash
# Production mode
docker-compose up --build -d

# Development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Services

The Docker setup includes the following services:

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Main database |
| Redis | 6379 | Cache and session storage |
| Backend | 5000 | Node.js API server |
| Frontend | 80 | React application with Nginx |
| Adminer | 8080 | Database management UI (dev only) |
| Redis Commander | 8081 | Redis management UI (dev only) |

## Common Commands

### Service Management
```bash
# Start services
make up

# Stop services
make down

# Restart services
make restart

# View logs
make logs

# View specific service logs
make logs-backend
make logs-frontend
```

### Database Operations
```bash
# Run migrations
make migrate

# Seed database
make seed

# Access PostgreSQL shell
make shell-postgres

# Backup database
make backup-db

# Restore database
docker-compose exec -T postgres psql -U lmsuser lmsdb < backups/backup_file.sql
```

### Development
```bash
# Start in development mode with hot reload
make dev

# Open shell in backend container
make shell

# Open shell in frontend container
make shell-frontend

# Run tests
make test
```

### Cleanup
```bash
# Stop and remove all containers, volumes
make clean
```

## Environment Modes

### Production Mode
- Optimized builds
- Nginx serves static files
- No development tools
- Minimal logging

### Development Mode
- Hot reload enabled
- Source code mounted as volumes
- Development tools included (Adminer, Redis Commander)
- Verbose logging

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U lmsuser -d lmsdb

# View PostgreSQL logs
make logs-postgres
```

### Backend Not Starting
```bash
# Check backend logs
make logs-backend

# Verify environment variables
docker-compose exec backend env | grep -E "DATABASE_URL|JWT_SECRET"

# Run migrations manually
docker-compose exec backend npx prisma migrate deploy
```

### Frontend Build Issues
```bash
# Check frontend logs
make logs-frontend

# Rebuild frontend
docker-compose build frontend
```

### Permission Issues
```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

### Port Conflicts
If you encounter port conflicts, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Change host port from 5432 to 5433
```

## Health Checks

All services include health checks. To view health status:
```bash
docker-compose ps
```

## Security Notes

1. **Never commit `.env` files** to version control
2. **Generate strong secrets** for production:
   ```bash
   # Generate JWT secret
   openssl rand -base64 64

   # Generate encryption key
   openssl rand -hex 32

   # Generate encryption IV
   openssl rand -hex 16
   ```

3. **Use strong passwords** for database and Redis
4. **Enable HTTPS** in production (add SSL certificates to Nginx)
5. **Restrict CORS origins** to your domain only

## Scaling

To scale services horizontally:
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

Note: You'll need a load balancer for multiple backend instances.

## Monitoring

For production monitoring, consider adding:
- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for log aggregation
- Health check endpoints monitoring

## Backup Strategy

### Automated Backups
Add to crontab for daily backups:
```bash
0 2 * * * cd /Users/amansharma/1fi && make backup-db
```

### Manual Backup
```bash
make backup-db
```

### Restore from Backup
```bash
# List available backups
ls -la backups/

# Restore specific backup
docker-compose exec -T postgres psql -U lmsuser lmsdb < backups/backup_20231225_120000.sql
```

## Support

For issues or questions:
1. Check the logs: `make logs`
2. Verify environment configuration: `.env`
3. Ensure all services are healthy: `docker-compose ps`
4. Check Docker resources: `docker system df`

## License

[Your License Here]