#!/bin/bash

# Fix Environment Variables and Redeploy Script

EC2_HOST="ec2-16-171-133-182.eu-north-1.compute.amazonaws.com"
EC2_USER="ec2-user"
KEY_FILE="default-chat-ai.pem"

echo "🔧 Fixing environment variables and redeploying..."

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: $KEY_FILE not found!"
    exit 1
fi

# Set correct permissions for key file
chmod 400 $KEY_FILE

echo "📦 Step 1: Copying updated files to EC2..."
scp -i $KEY_FILE -r frontend/src/store/useAuthStore.js $EC2_USER@$EC2_HOST:/home/$EC2_USER/default-cha-ai/frontend/src/store/
scp -i $KEY_FILE -r frontend/src/lib/axios.js $EC2_USER@$EC2_HOST:/home/$EC2_USER/default-cha-ai/frontend/src/lib/
scp -i $KEY_FILE -r frontend/nginx.conf $EC2_USER@$EC2_HOST:/home/$EC2_USER/default-cha-ai/frontend/

echo "🔧 Step 2: Fixing environment variables and redeploying..."
ssh -i $KEY_FILE $EC2_USER@$EC2_HOST << 'EOF'
    cd /home/ec2-user/default-cha-ai
    
    # Update FRONTEND_URL in backend .env
    if [ -f "backend/.env" ]; then
        # Backup original
        cp backend/.env backend/.env.backup
        
        # Update FRONTEND_URL to use the correct domain
        sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=http://16.171.133.182|' backend/.env
        
        echo "✅ Updated FRONTEND_URL in backend/.env"
    else
        echo "❌ backend/.env not found!"
        exit 1
    fi
    
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
    
    # Show recent logs
    echo "📋 Recent logs:"
    docker-compose logs --tail=10
    
    echo "✅ Redeployment completed!"
    echo "🌐 Your app should be available at: http://16.171.133.182"
EOF

echo ""
echo "🎉 Fix completed!"
echo "🌐 Frontend: http://16.171.133.182"
echo "🔗 Backend API: http://16.171.133.182/api"
echo ""
echo "📝 If you still see issues, check the logs:"
echo "   ssh -i $KEY_FILE $EC2_USER@$EC2_HOST 'cd default-cha-ai && docker-compose logs'" 