#!/bin/bash

# Complete EC2 Deployment Script for Chat App

EC2_IP="16-171-133-182"
EC2_USER="ec2-user"
KEY_FILE="default-chat-ai.pem"

echo "🚀 Starting complete EC2 deployment for Chat App..."
echo "📍 Target: $EC2_USER@$EC2_IP"
echo ""

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: $KEY_FILE not found!"
    exit 1
fi

# Set correct permissions for key file
chmod 400 $KEY_FILE

echo "📦 Step 1: Copying project files to EC2..."
scp -i $KEY_FILE -r . $EC2_USER@$EC2_IP:/home/$EC2_USER/chat-app/

echo "🔧 Step 2: Setting up EC2 instance..."
ssh -i $KEY_FILE $EC2_USER@$EC2_IP << 'EOF'
    echo "📦 Updating system packages..."
    sudo yum update -y
    
    echo "🐳 Installing Docker..."
    sudo yum install -y docker
    
    echo "🚀 Starting Docker service..."
    sudo systemctl start docker
    sudo systemctl enable docker
    
    echo "👤 Adding user to docker group..."
    sudo usermod -a -G docker ec2-user
    
    echo "📋 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "📚 Installing Git..."
    sudo yum install -y git
    
    echo "📁 Setting up application directory..."
    cd /home/ec2-user/chat-app
    sudo chown -R ec2-user:ec2-user /home/ec2-user/chat-app
    
    echo "✅ EC2 setup completed!"
EOF

echo "🔄 Step 3: Reconnecting to apply Docker group changes..."
ssh -i $KEY_FILE $EC2_USER@$EC2_IP << 'EOF'
    echo "🔨 Building and starting containers..."
    cd /home/ec2-user/chat-app
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Clean up old images
    docker system prune -f
    
    # Build and start containers
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    echo "🔍 Checking service status..."
    docker-compose ps
    
    echo "📋 Recent logs:"
    docker-compose logs --tail=10
    
    echo "✅ Deployment completed!"
    echo "🌐 Your app should be available at: http://16-171-133-182"
    echo "🔗 Backend API: http://16-171-133-182:5001"
EOF

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: http://16-171-133-182"
echo "🔗 Backend API: http://16-171-133-182:5001"
echo ""
echo "📝 Next steps:"
echo "   1. Configure environment variables in backend/.env"
echo "   2. Check logs: ssh -i $KEY_FILE $EC2_USER@$EC2_IP 'cd chat-app && docker-compose logs'"
echo "   3. Restart if needed: ssh -i $KEY_FILE $EC2_USER@$EC2_IP 'cd chat-app && docker-compose restart'" 