#!/bin/bash

# Portfolio Manager Deployment Script

echo "Starting deployment..."

# Install dependencies
npm install --production

# Stop existing PM2 processes
pm2 delete all || true

# Start applications with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup (run once on server)
# pm2 startup

echo "Deployment completed!"
echo "Backend running on port 3001"
echo "Frontend running on port 4000"

# Show status
pm2 status