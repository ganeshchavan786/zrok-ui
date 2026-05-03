# 🚀 Local Development Setup

## Port Configuration
- **Backend**: http://localhost:3666
- **Frontend**: http://localhost:3555
- **Redis**: localhost:6379

---

## 📦 Step 1: Start Redis (Docker WSL)

```bash
# WSL मध्ये Redis start करा
docker compose -f docker-compose.redis-only.yml up -d

# Redis चालतोय का check करा
docker ps
docker logs zrokui-redis
```

---

## 🔧 Step 2: Start Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
✓ Backend running on http://localhost:3666
✓ Health check: http://localhost:3666/health
```

**Test Backend:**
```bash
curl http://localhost:3666/health
```

---

## 🎨 Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3555/
➜  Network: use --host to expose
```

**Open Browser:**
```
http://localhost:3555
```

---

## ✅ Verify Everything

1. **Redis**: `docker ps` - zrokui-redis should be running
2. **Backend**: http://localhost:3666/health
3. **Frontend**: http://localhost:3555

---

## 🛑 Stop Everything

```bash
# Stop frontend/backend: Ctrl+C in terminals

# Stop Redis:
docker compose -f docker-compose.redis-only.yml down
```

---

## 🐛 Troubleshooting

### Redis Connection Error
```bash
# Check Redis is running
docker ps | grep redis

# Check Redis logs
docker logs zrokui-redis

# Restart Redis
docker compose -f docker-compose.redis-only.yml restart
```

### Port Already in Use
```bash
# Check what's using port 3666
netstat -ano | findstr :3666

# Check what's using port 3555
netstat -ano | findstr :3555

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Backend Can't Connect to Redis
- Check `backend/.env` has correct REDIS_HOST=localhost
- Check Redis password matches in both files
- Try: `redis-cli -h localhost -p 6379 -a <password> ping`

---

## 📝 Next Steps: GitHub GHCR Deployment

See `DEPLOY-GHCR.md` for deployment instructions.
