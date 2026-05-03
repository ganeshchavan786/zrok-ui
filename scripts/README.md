# 🔧 Scripts

Utility scripts for zrokui setup and maintenance.

## 📁 Available Scripts

### `bootstrap.sh` - Initial Project Setup
**Purpose:** Complete project initialization and dependency installation

**Usage:**
```bash
./scripts/bootstrap.sh
```

**What it does:**
1. Checks Node.js and npm installation
2. Installs backend dependencies
3. Installs frontend dependencies
4. Installs CLI dependencies
5. Creates .env files from examples
6. Verifies Docker installation
7. Sets up Redis container

**Requirements:**
- Node.js 20+
- npm 9+
- Docker (optional)

**Output:**
```
✓ Node.js installed (v20.x.x)
✓ npm installed (v9.x.x)
✓ Backend dependencies installed
✓ Frontend dependencies installed
✓ CLI dependencies installed
✓ Environment files created
✓ Docker available
✓ Redis container started
```

---

### `start-local.sh` - Start Local Development
**Purpose:** Quick start for local development environment

**Usage:**
```bash
./scripts/start-local.sh
```

**What it does:**
1. Starts Redis container (if not running)
2. Starts backend server (port 3666)
3. Starts frontend dev server (port 3555)
4. Opens browser to http://localhost:3555

**Requirements:**
- Dependencies installed (run bootstrap.sh first)
- Docker (for Redis)

**Output:**
```
✓ Starting Redis...
✓ Redis running on port 6379
✓ Starting backend on port 3666...
✓ Starting frontend on port 3555...
✓ Opening browser...

🚀 zrokui is running!
   Backend:  http://localhost:3666
   Frontend: http://localhost:3555
   Redis:    localhost:6379
```

**Stop Services:**
```bash
# Press Ctrl+C in terminal
# Or kill processes:
pkill -f "npm run dev"
docker stop zrokui-redis
```

---

### `fix-docker-dns.sh` - Fix Docker DNS Issues
**Purpose:** Resolve Docker DNS resolution problems on Linux

**Usage:**
```bash
sudo ./scripts/fix-docker-dns.sh
```

**What it does:**
1. Stops Docker daemon
2. Updates Docker DNS configuration
3. Sets Google DNS (8.8.8.8, 8.8.4.4)
4. Restarts Docker daemon
5. Verifies DNS resolution

**When to use:**
- Docker containers can't resolve domain names
- `apt-get update` fails in Dockerfile
- Network connectivity issues in containers

**Configuration:**
Creates/updates `/etc/docker/daemon.json`:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

**Requirements:**
- Linux system
- sudo/root access
- systemd (for service management)

**Output:**
```
✓ Stopping Docker...
✓ Updating DNS configuration...
✓ Restarting Docker...
✓ DNS resolution working
```

---

## 🚀 Quick Start Workflow

### First Time Setup
```bash
# 1. Clone repository
git clone https://github.com/ganeshchavan786/zrok-ui.git
cd zrok-ui

# 2. Make scripts executable
chmod +x scripts/*.sh

# 3. Run bootstrap
./scripts/bootstrap.sh

# 4. Start development
./scripts/start-local.sh
```

### Daily Development
```bash
# Start everything
./scripts/start-local.sh

# Work on your code...

# Stop (Ctrl+C in terminal)
```

---

## 🔧 Script Details

### Bootstrap Script Flow
```
bootstrap.sh
├── Check Node.js/npm
├── Install backend deps
│   └── cd backend && npm install
├── Install frontend deps
│   └── cd frontend && npm install
├── Install CLI deps
│   └── cd cli && npm install
├── Create .env files
│   ├── cp .env.example .env
│   ├── cp backend/.env.example backend/.env
│   └── Generate JWT_SECRET
├── Check Docker
└── Start Redis
    └── docker-compose -f docker/docker-compose.redis-only.yml up -d
```

### Start Local Script Flow
```
start-local.sh
├── Check Redis
│   └── Start if not running
├── Start Backend
│   └── cd backend && npm run dev &
├── Start Frontend
│   └── cd frontend && npm run dev &
├── Wait for services
│   ├── Wait for backend (3666)
│   └── Wait for frontend (3555)
└── Open browser
    └── xdg-open/open http://localhost:3555
```

### Fix Docker DNS Flow
```
fix-docker-dns.sh
├── Check root access
├── Stop Docker
│   └── systemctl stop docker
├── Backup daemon.json
│   └── cp /etc/docker/daemon.json /etc/docker/daemon.json.bak
├── Update DNS config
│   └── echo '{"dns":["8.8.8.8","8.8.4.4"]}' > /etc/docker/daemon.json
├── Start Docker
│   └── systemctl start docker
└── Test DNS
    └── docker run --rm alpine nslookup google.com
```

---

## 🐛 Troubleshooting

### Bootstrap Script Issues

**Problem:** "Node.js not found"
```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Problem:** "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Try again
./scripts/bootstrap.sh
```

**Problem:** "Docker not found"
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

---

### Start Local Script Issues

**Problem:** "Port 3666 already in use"
```bash
# Find and kill process
lsof -ti:3666 | xargs kill -9

# Or use different port
PORT=3667 ./scripts/start-local.sh
```

**Problem:** "Redis connection failed"
```bash
# Check Redis
docker ps | grep redis

# Restart Redis
docker restart zrokui-redis

# Or start manually
cd docker
docker-compose -f docker-compose.redis-only.yml up -d
```

**Problem:** "Frontend won't start"
```bash
# Check if port 3555 is free
lsof -ti:3555 | xargs kill -9

# Clear Vite cache
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

### Fix Docker DNS Issues

**Problem:** "systemctl not found"
```bash
# For non-systemd systems, restart Docker manually
sudo service docker stop
sudo service docker start
```

**Problem:** "Permission denied"
```bash
# Run with sudo
sudo ./scripts/fix-docker-dns.sh
```

**Problem:** "DNS still not working"
```bash
# Try alternative DNS
sudo nano /etc/docker/daemon.json
# Change to: {"dns": ["1.1.1.1", "1.0.0.1"]}

sudo systemctl restart docker
```

---

## 📝 Creating Custom Scripts

### Template
```bash
#!/bin/bash

# Script name and description
# Usage: ./scripts/my-script.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Main script logic
main() {
    log_info "Starting..."
    
    # Your code here
    
    log_info "Done!"
}

# Run main function
main "$@"
```

### Make Executable
```bash
chmod +x scripts/my-script.sh
```

---

## 🔐 Security Notes

### Script Permissions
```bash
# Scripts should be executable by owner only
chmod 700 scripts/*.sh

# Or readable by group
chmod 750 scripts/*.sh
```

### Environment Variables
```bash
# Never commit .env files
# Use .env.example as template
# Generate secrets:
openssl rand -base64 32
```

### Sudo Usage
```bash
# Only fix-docker-dns.sh requires sudo
# Other scripts run as regular user
# Never run npm as root!
```

---

## 📚 Related Documentation

- [Quick Reference](../docs/QUICK-REFERENCE.md)
- [Start Local Development](../docs/START-LOCAL.md)
- [VPS Deployment](../docs/VPS-DEPLOYMENT.md)
- [Docker Configuration](../docker/README.md)

---

**Last Updated:** May 3, 2026  
**Shell:** bash 4.0+  
**OS Support:** Linux, macOS, WSL
