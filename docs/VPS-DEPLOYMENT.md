# 🚀 VPS Deployment Guide

## 📊 Port Summary

| Service | VPS Port | Access |
|---------|----------|--------|
| Frontend | **3555** | `http://YOUR_VPS_IP:3555` |
| Backend | **3666** | `http://YOUR_VPS_IP:3666` |
| Redis | Internal | Not exposed |

---

## 🔧 Step-by-Step Deployment

### Step 1: Prepare VPS

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

---

### Step 2: Open Firewall Ports

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (IMPORTANT!)
sudo ufw allow 22/tcp

# Allow application ports
sudo ufw allow 3555/tcp comment 'zrokui frontend'
sudo ufw allow 3666/tcp comment 'zrokui backend'

# Optional: Allow HTTP/HTTPS for Nginx
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

**Expected Output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
3555/tcp                   ALLOW       Anywhere    # zrokui frontend
3666/tcp                   ALLOW       Anywhere    # zrokui backend
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

### Step 3: Create Project Directory

```bash
# Create directory
mkdir -p ~/zrokui
cd ~/zrokui

# Download docker-compose file
curl -O https://raw.githubusercontent.com/ganeshchavan786/zrok-ui/main/docker-compose.prod.yml

# Verify download
cat docker-compose.prod.yml
```

---

### Step 4: Create Environment File

```bash
# Create .env file
nano .env
```

**Add these variables:**
```bash
# Redis
REDIS_PASSWORD=d8a206cf62819982762e49ecc5d38057fa4a0962fba3d93f034dc38aff121293

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random

# Domain (use VPS IP if no domain)
BASE_DOMAIN=YOUR_VPS_IP

# Admin
ADMIN_EMAIL=admin@yourdomain.com
INVITES_ONLY=false

# SMTP (optional - for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

---

### Step 5: Deploy Application

```bash
# Pull images (packages must be public!)
docker compose -f docker-compose.prod.yml pull

# Start services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE                                              STATUS         PORTS
abc123def456   ghcr.io/ganeshchavan786/zrok-ui/frontend:latest   Up 10 seconds  0.0.0.0:3555->80/tcp
def456ghi789   ghcr.io/ganeshchavan786/zrok-ui/backend:latest    Up 10 seconds  0.0.0.0:3666->3666/tcp
ghi789jkl012   redis:7-alpine                                     Up 10 seconds  6379/tcp
```

---

### Step 6: Verify Deployment

```bash
# Check logs
docker logs zrokui-backend
docker logs zrokui-frontend
docker logs zrokui-redis

# Test backend health
curl http://localhost:3666/health

# Expected response:
# {"success":true,"message":"zrokui backend is running","port":3666}
```

---

### Step 7: Access Application

#### From Browser:

**Frontend:**
```
http://YOUR_VPS_IP:3555
```

**Backend API:**
```
http://YOUR_VPS_IP:3666/health
http://YOUR_VPS_IP:3666/api/status
```

**Example** (if VPS IP is 192.168.1.100):
```
Frontend:  http://192.168.1.100:3555
Backend:   http://192.168.1.100:3666/health
```

---

## 🔄 Management Commands

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker logs -f zrokui-backend
docker logs -f zrokui-frontend
docker logs -f zrokui-redis
```

### Restart Services
```bash
# All services
docker compose -f docker-compose.prod.yml restart

# Specific service
docker restart zrokui-backend
docker restart zrokui-frontend
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml down
```

### Update to Latest Version
```bash
cd ~/zrokui
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Check Resource Usage
```bash
docker stats
```

---

## 🌐 Setup Domain (Optional)

### Option 1: Direct Port Access (Current)
```
Frontend:  http://yourdomain.com:3555
Backend:   http://yourdomain.com:3666
```

**DNS A Records:**
```
@ (or yourdomain.com)  →  YOUR_VPS_IP
```

### Option 2: Nginx Reverse Proxy (Recommended)

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/zrokui
```

**Add configuration:**
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3666;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/zrokui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**DNS A Records:**
```
@                      →  YOUR_VPS_IP
www                    →  YOUR_VPS_IP
api                    →  YOUR_VPS_IP
```

**Access:**
```
Frontend:  http://yourdomain.com
Backend:   http://api.yourdomain.com
```

---

## 🔒 Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

**After SSL:**
```
Frontend:  https://yourdomain.com
Backend:   https://api.yourdomain.com
```

---

## 🐛 Troubleshooting

### Can't Access on Port 3555/3666

**Check firewall:**
```bash
sudo ufw status
sudo ufw allow 3555/tcp
sudo ufw allow 3666/tcp
```

**Check if ports are listening:**
```bash
sudo netstat -tulpn | grep 3555
sudo netstat -tulpn | grep 3666
```

### Container Not Starting

**Check logs:**
```bash
docker logs zrokui-backend
docker logs zrokui-frontend
```

**Common issues:**
- Missing .env file
- Wrong environment variables
- Port already in use

### Can't Pull Images

**Make packages public:**
1. Go to: https://github.com/ganeshchavan786?tab=packages
2. Click package → Settings → Change visibility → Public

**Or login to GHCR:**
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u ganeshchavan786 --password-stdin
```

### Redis Connection Error

**Check Redis is running:**
```bash
docker logs zrokui-redis
docker exec -it zrokui-redis redis-cli -a YOUR_PASSWORD ping
```

---

## 📊 Monitoring

### Check Service Health
```bash
# Backend health
curl http://localhost:3666/health

# Frontend (should return HTML)
curl http://localhost:3555

# Redis
docker exec -it zrokui-redis redis-cli -a YOUR_PASSWORD ping
```

### View Resource Usage
```bash
docker stats --no-stream
```

### Check Disk Space
```bash
df -h
docker system df
```

---

## 🔐 Security Checklist

- [ ] Change default REDIS_PASSWORD
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable firewall (ufw)
- [ ] Only open required ports (3555, 3666, 22)
- [ ] Setup SSL/TLS certificates
- [ ] Regular backups of Redis data
- [ ] Keep Docker images updated
- [ ] Monitor logs for suspicious activity
- [ ] Use strong SSH keys (disable password auth)

---

## 📝 Quick Reference

```bash
# Start
docker compose -f docker-compose.prod.yml up -d

# Stop
docker compose -f docker-compose.prod.yml down

# Restart
docker compose -f docker-compose.prod.yml restart

# Update
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Logs
docker logs -f zrokui-backend

# Status
docker ps
```

---

## 🎯 Access URLs

**Without Domain:**
```
Frontend:  http://YOUR_VPS_IP:3555
Backend:   http://YOUR_VPS_IP:3666
```

**With Domain (Nginx):**
```
Frontend:  http://yourdomain.com
Backend:   http://api.yourdomain.com
```

**With SSL:**
```
Frontend:  https://yourdomain.com
Backend:   https://api.yourdomain.com
```

---

**Repository**: https://github.com/ganeshchavan786/zrok-ui
