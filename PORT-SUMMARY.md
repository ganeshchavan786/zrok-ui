# 🔌 Port Configuration Summary

## 📊 Complete Port Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VPS SERVER                                  │
│                   IP: YOUR_VPS_IP                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Port 3555 (Frontend)                                     │  │
│  │  http://YOUR_VPS_IP:3555                                  │  │
│  │  ↓                                                         │  │
│  │  Docker Container: zrokui-frontend                        │  │
│  │  Image: ghcr.io/ganeshchavan786/zrok-ui/frontend:latest  │  │
│  │  Internal Port: 80                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Port 3666 (Backend API)                                  │  │
│  │  http://YOUR_VPS_IP:3666                                  │  │
│  │  ↓                                                         │  │
│  │  Docker Container: zrokui-backend                         │  │
│  │  Image: ghcr.io/ganeshchavan786/zrok-ui/backend:latest   │  │
│  │  Internal Port: 3666                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
│                         │ Redis Connection                       │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Redis (Internal Only)                                    │  │
│  │  NOT exposed to internet                                  │  │
│  │  ↓                                                         │  │
│  │  Docker Container: zrokui-redis                           │  │
│  │  Image: redis:7-alpine                                    │  │
│  │  Internal Port: 6379                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Access Methods

### Method 1: Direct IP Access (Default)

| Service | URL | Port |
|---------|-----|------|
| Frontend | `http://YOUR_VPS_IP:3555` | 3555 |
| Backend | `http://YOUR_VPS_IP:3666` | 3666 |

**Example** (VPS IP: 192.168.1.100):
```
Frontend:  http://192.168.1.100:3555
Backend:   http://192.168.1.100:3666/health
```

---

### Method 2: Domain with Ports

| Service | URL | Port |
|---------|-----|------|
| Frontend | `http://yourdomain.com:3555` | 3555 |
| Backend | `http://yourdomain.com:3666` | 3666 |

**DNS Setup:**
```
A Record:  @  →  YOUR_VPS_IP
```

---

### Method 3: Nginx Reverse Proxy (Recommended)

| Service | URL | Backend Port |
|---------|-----|--------------|
| Frontend | `http://yourdomain.com` | → 3555 |
| Backend | `http://api.yourdomain.com` | → 3666 |

**DNS Setup:**
```
A Record:  @    →  YOUR_VPS_IP
A Record:  www  →  YOUR_VPS_IP
A Record:  api  →  YOUR_VPS_IP
```

**With SSL:**
```
Frontend:  https://yourdomain.com
Backend:   https://api.yourdomain.com
```

---

## 🔥 Firewall Configuration

### Required Ports to Open:

```bash
# SSH (CRITICAL - Don't lock yourself out!)
Port 22   - SSH access

# Application Ports
Port 3555 - Frontend (React app)
Port 3666 - Backend (API)

# Optional (if using Nginx)
Port 80   - HTTP
Port 443  - HTTPS
```

### Ubuntu/Debian (ufw):
```bash
sudo ufw allow 22/tcp
sudo ufw allow 3555/tcp
sudo ufw allow 3666/tcp
sudo ufw allow 80/tcp    # Optional
sudo ufw allow 443/tcp   # Optional
sudo ufw enable
```

### CentOS/RHEL (firewalld):
```bash
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=3555/tcp
sudo firewall-cmd --permanent --add-port=3666/tcp
sudo firewall-cmd --permanent --add-port=80/tcp    # Optional
sudo firewall-cmd --permanent --add-port=443/tcp   # Optional
sudo firewall-cmd --reload
```

---

## 📋 Port Mapping Details

### Frontend Container
```yaml
ports:
  - "3555:80"
```
- **Host Port**: 3555 (accessible from internet)
- **Container Port**: 80 (Nginx inside container)
- **Access**: `http://VPS_IP:3555`

### Backend Container
```yaml
ports:
  - "3666:3666"
```
- **Host Port**: 3666 (accessible from internet)
- **Container Port**: 3666 (Node.js Express server)
- **Access**: `http://VPS_IP:3666`

### Redis Container
```yaml
# No ports exposed to host
```
- **Container Port**: 6379 (internal only)
- **Access**: Only from other containers in same network
- **NOT accessible** from internet or host

---

## 🔐 Security Notes

### Exposed Ports:
- ✅ **3555** - Frontend (public access needed)
- ✅ **3666** - Backend API (public access needed)
- ❌ **6379** - Redis (NOT exposed - internal only)

### Best Practices:
1. **Always keep SSH port 22 open** (or you'll be locked out!)
2. **Use strong passwords** for Redis
3. **Use JWT secrets** that are 32+ characters
4. **Enable firewall** before deploying
5. **Setup SSL/TLS** for production
6. **Regular security updates**

---

## 🧪 Testing Ports

### From VPS (SSH):
```bash
# Test frontend
curl http://localhost:3555

# Test backend
curl http://localhost:3666/health

# Test Redis (internal)
docker exec -it zrokui-redis redis-cli -a YOUR_PASSWORD ping
```

### From Your Computer:
```bash
# Test frontend
curl http://YOUR_VPS_IP:3555

# Test backend
curl http://YOUR_VPS_IP:3666/health

# Test if ports are open
telnet YOUR_VPS_IP 3555
telnet YOUR_VPS_IP 3666
```

### From Browser:
```
Frontend:  http://YOUR_VPS_IP:3555
Backend:   http://YOUR_VPS_IP:3666/health
```

---

## 🚀 Deployment Commands

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Create directory
mkdir -p ~/zrokui && cd ~/zrokui

# Download docker-compose
curl -O https://raw.githubusercontent.com/ganeshchavan786/zrok-ui/main/docker-compose.prod.yml

# Create .env file
nano .env
# (Add environment variables)

# Open firewall ports
sudo ufw allow 3555/tcp
sudo ufw allow 3666/tcp

# Deploy
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Verify
docker ps
curl http://localhost:3666/health
```

---

## 📊 Port Status Check

```bash
# Check if ports are listening
sudo netstat -tulpn | grep 3555
sudo netstat -tulpn | grep 3666

# Check Docker port mappings
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Check firewall status
sudo ufw status numbered
```

**Expected Output:**
```
CONTAINER NAME      PORTS
zrokui-frontend     0.0.0.0:3555->80/tcp
zrokui-backend      0.0.0.0:3666->3666/tcp
zrokui-redis        6379/tcp (not exposed)
```

---

## 🎯 Quick Reference

| What | Where | Port |
|------|-------|------|
| **Local Development** | | |
| Frontend | http://localhost:3555 | 3555 |
| Backend | http://localhost:3666 | 3666 |
| Redis | localhost:6379 | 6379 |
| **VPS Production** | | |
| Frontend | http://VPS_IP:3555 | 3555 |
| Backend | http://VPS_IP:3666 | 3666 |
| Redis | Internal only | - |
| **With Domain** | | |
| Frontend | http://yourdomain.com | 80/443 |
| Backend | http://api.yourdomain.com | 80/443 |

---

## 📚 Related Documentation

- **VPS-DEPLOYMENT.md** - Complete deployment guide
- **DEPLOY-GHCR.md** - GitHub Container Registry setup
- **PROJECT-PORTS.md** - Architecture overview
- **nginx-vps.conf** - Nginx configuration example

---

**Repository**: https://github.com/ganeshchavan786/zrok-ui
