#!/bin/bash

# Deployment script for Chat App on AWS EC2

echo "🚀 Starting deployment process..."

# Stop and remove existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Remove old images to free up space
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: http://your-ec2-public-ip" 