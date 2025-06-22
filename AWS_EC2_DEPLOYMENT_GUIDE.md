# AWS EC2 Deployment Guide for Chat App

## Prerequisites

- AWS Account
- EC2 Instance (t2.micro or larger recommended)
- Domain name (optional, for SSL)

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose Amazon Linux 2 AMI
3. Select instance type: t2.micro (free tier) or t2.small for better performance
4. Configure Security Group:
   - HTTP (80) - Allow from anywhere
   - HTTPS (443) - Allow from anywhere (if using SSL)
   - SSH (22) - Allow from your IP
   - Custom TCP (5001) - Allow from anywhere (for backend API)

### 1.2 Configure Storage

- Root volume: 8GB minimum (20GB recommended)
- Add additional EBS volume if needed for data persistence

## Step 2: Connect to EC2 Instance

```bash
# Using SSH key
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Or using AWS Systems Manager Session Manager
```

## Step 3: Setup EC2 Instance

### 3.1 Run Setup Script

```bash
# Download and run the setup script
curl -O https://raw.githubusercontent.com/your-repo/chat-app/main/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh
```

### 3.2 Logout and Login Again

```bash
exit
# SSH back into the instance
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

## Step 4: Deploy Application

### 4.1 Clone Repository

```bash
cd /home/ec2-user/chat-app
git clone https://github.com/your-username/your-repo.git .
```

### 4.2 Configure Environment Variables

```bash
# Copy example environment file
cp backend/env.example backend/.env

# Edit the environment file with your actual values
nano backend/.env
```

**Required Environment Variables:**

```bash
# Server Configuration
PORT=5001
NODE_ENV=production

# MongoDB Configuration (using containerized MongoDB)
MONGODB_URI=mongodb://mongo:27017/chat-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Frontend URL
FRONTEND_URL=http://your-ec2-public-ip
```

### 4.3 Deploy Application

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Step 5: Verify Deployment

### 5.1 Check Container Status

```bash
docker-compose ps
```

### 5.2 Check Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo
```

### 5.3 Test Application

- Frontend: http://your-ec2-public-ip
- Backend API: http://your-ec2-public-ip:5001

## Step 6: SSL Configuration (Optional)

### 6.1 Install Certbot

```bash
sudo yum install -y certbot python3-certbot-nginx
```

### 6.2 Get SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

### 6.3 Update Environment Variables

```bash
# Update FRONTEND_URL in backend/.env
FRONTEND_URL=https://your-domain.com
```

## Step 7: Monitoring and Maintenance

### 7.1 View Real-time Logs

```bash
docker-compose logs -f
```

### 7.2 Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### 7.3 Update Application

```bash
# Pull latest changes
git pull

# Redeploy
./deploy.sh
```

### 7.4 Backup Database

```bash
# Create backup
docker exec fullstack-chat-app-mongo-1 mongodump --out /data/backup

# Copy backup to host
docker cp fullstack-chat-app-mongo-1:/data/backup ./backup
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   sudo netstat -tulpn | grep :80
   sudo kill -9 <PID>
   ```

2. **Docker Permission Issues**

   ```bash
   sudo usermod -a -G docker ec2-user
   # Logout and login again
   ```

3. **MongoDB Connection Issues**

   ```bash
   docker-compose logs mongo
   docker-compose restart mongo
   ```

4. **Frontend Not Loading**
   ```bash
   docker-compose logs frontend
   docker-compose restart frontend
   ```

### Performance Optimization

1. **Increase Swap Memory**

   ```bash
   sudo dd if=/dev/zero of=/swapfile bs=128M count=16
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

2. **Monitor Resource Usage**
   ```bash
   docker stats
   htop
   ```

## Security Considerations

1. **Update Security Group**: Only allow necessary ports
2. **Use Strong Passwords**: For MongoDB and JWT secrets
3. **Regular Updates**: Keep Docker images updated
4. **Backup Strategy**: Regular database backups
5. **Monitoring**: Set up CloudWatch alarms

## Cost Optimization

1. **Use Spot Instances**: For non-critical workloads
2. **Right-size Instances**: Monitor usage and adjust
3. **Use Reserved Instances**: For predictable workloads
4. **Clean Up**: Remove unused Docker images regularly

## Support

For issues or questions:

1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Check security group settings
4. Ensure all required services are running
