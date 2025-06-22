#!/bin/bash

# EC2 Setup script for Chat App deployment

echo "🔧 Setting up EC2 instance for Chat App deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker

# Start Docker service
echo "🚀 Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "📋 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo yum install -y git

# Create app directory
echo "📁 Creating application directory..."
mkdir -p /home/ec2-user/chat-app
cd /home/ec2-user/chat-app

# Set proper permissions
echo "🔐 Setting proper permissions..."
sudo chown -R ec2-user:ec2-user /home/ec2-user/chat-app

echo "✅ EC2 setup completed!"
echo "🔄 Please log out and log back in for Docker group changes to take effect."
echo "📝 Next steps:"
echo "   1. Clone your repository: git clone <your-repo-url>"
echo "   2. Copy your .env file to backend/.env"
echo "   3. Run: chmod +x deploy.sh && ./deploy.sh" 