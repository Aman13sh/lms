# PostgreSQL Dockerfile with proper authentication setup
FROM postgres:16-alpine

# Set environment variables for initialization
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=lms_db
ENV PGDATA=/var/lib/postgresql/data/pgdata

# Copy initialization script and configuration
COPY init.sql /docker-entrypoint-initdb.d/
COPY pg_hba.conf /tmp/pg_hba.conf

# Add script to apply custom configuration
RUN echo '#!/bin/bash' > /docker-entrypoint-initdb.d/01-configure.sh && \
    echo 'cp /tmp/pg_hba.conf $PGDATA/pg_hba.conf' >> /docker-entrypoint-initdb.d/01-configure.sh && \
    chmod +x /docker-entrypoint-initdb.d/01-configure.sh

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres -d lms_db || exit 1