#!/bin/bash

# Fix Authentication Issue Script

EC2_HOST="ec2-16-171-133-182.eu-north-1.compute.amazonaws.com"
EC2_USER="ec2-user"
KEY_FILE="default-chat-ai.pem"

echo "🔧 Fixing authentication issue..."

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: $KEY_FILE not found!"
    exit 1
fi

# Set correct permissions for key file
chmod 400 $KEY_FILE

echo "📦 Step 1: Copying updated useAuthStore.js to EC2..."
scp -i $KEY_FILE frontend/src/store/useAuthStore.js $EC2_USER@$EC2_HOST:/home/$EC2_USER/default-cha-ai/frontend/src/store/

echo "🔧 Step 2: Rebuilding and restarting containers..."
ssh -i $KEY_FILE $EC2_USER@$EC2_HOST << 'EOF'
    cd /home/ec2-user/default-cha-ai
    
    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose down
    
    # Rebuild and start containers
    echo "🔨 Rebuilding and starting containers..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check service status
    echo "🔍 Checking service status..."
    docker-compose ps
    
    echo "✅ Authentication fix completed!"
    echo "🌐 Your app should be available at: http://16.171.133.182"
EOF

echo ""
echo "🎉 Authentication fix completed!"
echo "🌐 Frontend: http://16.171.133.182"
echo ""
echo "📝 The 'unauthorized no token provided' error should now be resolved."
echo "   Try creating an account again!" 