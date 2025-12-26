-- PostgreSQL initialization script
-- This script runs when the container is first created

-- Ensure the database exists
SELECT 'CREATE DATABASE lms_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lms_db')\gexec

-- Connect to lms_db
\c lms_db;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- Grant all privileges to postgres user
GRANT ALL PRIVILEGES ON DATABASE lms_db TO postgres;
GRANT ALL ON SCHEMA public TO postgres;

-- Set password encryption
ALTER USER postgres WITH ENCRYPTED PASSWORD 'postgres';

-- Configure authentication
ALTER SYSTEM SET password_encryption = 'md5';

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Database lms_db initialized successfully';
END
$$;