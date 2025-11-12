#!/bin/sh

# Ensure data directory exists
mkdir -p data

# Create .env file from example if it doesn't exist (for local development)
# In Docker, environment variables are passed directly
if [ ! -f .env ] && [ -f .env.example ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
fi

# Set default environment variables if not set
export PORT=${PORT:-3001}
export JWT_SECRET=${JWT_SECRET:-kanext-iq-super-secret-jwt-key-2024-production-ready-min-32-chars}
export FRONTEND_URL=${FRONTEND_URL:-*}
export NODE_ENV=${NODE_ENV:-production}

echo "Starting backend server..."
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"

# Start the server
node server.js

