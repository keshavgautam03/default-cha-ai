#!/bin/bash

# EC2 Connection Script for Chat App

# Replace YOUR_EC2_PUBLIC_IP with your actual EC2 public IP address
EC2_IP="YOUR_EC2_PUBLIC_IP"

echo "🔗 Connecting to EC2 instance..."
echo "📍 IP Address: $EC2_IP"
echo "🔑 Using key: default-chat-ai.pem"
echo ""

# Check if key file exists
if [ ! -f "default-chat-ai.pem" ]; then
    echo "❌ Error: default-chat-ai.pem not found!"
    echo "Please make sure the key file is in the current directory."
    exit 1
fi

# Check key file permissions
if [ "$(stat -f %Lp default-chat-ai.pem)" != "400" ]; then
    echo "🔐 Setting correct permissions for key file..."
    chmod 400 default-chat-ai.pem
fi

echo "🚀 Connecting to EC2 instance..."
echo "📝 Commands to run after connecting:"
echo "   1. Run setup: ./setup-ec2.sh"
echo "   2. Clone repo: git clone <your-repo-url>"
echo "   3. Configure env: cp backend/env.example backend/.env && nano backend/.env"
echo "   4. Deploy: ./deploy.sh"
echo ""

# Connect to EC2 instance
ssh -i default-chat-ai.pem ec2-user@$EC2_IP 