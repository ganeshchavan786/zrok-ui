# 🚀 Run zrokui Locally (Without Docker)

Docker network issues असल्यास locally run करा:

## 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend चालेल: **http://localhost:3666**

---

## 2️⃣ Frontend Setup

नवीन terminal मध्ये:

```bash
cd frontend
npm install
npm run dev
```

Frontend चालेल: **http://localhost:3555**

---

## 3️⃣ Redis (Optional)

Redis locally install करा किंवा skip करा (backend Redis शिवाय पण चालेल)

---

## ✅ Access URLs

- **Frontend:** http://localhost:3555
- **Backend API:** http://localhost:3666/health
- **Backend Status:** http://localhost:3666/api/status

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Windows PowerShell
netstat -ano | findstr :3666
netstat -ano | findstr :3555

# Kill process
taskkill /PID <process_id> /F
```

### Module not found?
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```
