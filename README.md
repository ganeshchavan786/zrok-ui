# 🚀 zrokui - Self-hosted zrok Management Platform

A modern, self-hosted web interface for managing zrok shares with user authentication, metrics, and CLI integration.

## 🎯 Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 📊 **Real-time Metrics** - Monitor bandwidth, connections, and usage
- 🌐 **Share Management** - Create and manage HTTP/TCP shares
- 💻 **CLI Integration** - Command-line tool for automation
- 🎨 **Modern UI** - Dark theme with Tailwind CSS
- 🐳 **Docker Ready** - Easy deployment with Docker Compose

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript + Redis
- **Frontend**: React 18 + Vite + Tailwind CSS
- **CLI**: Node.js + Commander + Chalk
- **Database**: Redis (sessions, cache, rate limiting)

## 📊 Ports

| Service  | Port | Description           |
|----------|------|-----------------------|
| Backend  | 3666 | Express API Server    |
| Frontend | 3555 | React Dev Server      |
| Redis    | 6379 | Cache & Session Store |

## 🚀 Quick Start

### Local Development

```bash
# 1. Start Redis (Docker)
docker compose -f docker-compose.redis-only.yml up -d

# 2. Start Backend (Terminal 1)
cd backend
npm install
npm run dev

# 3. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

Open http://localhost:3555 in your browser.

### Full Docker Stack

```bash
# Start all services
docker compose up -d

# View logs
docker logs -f zrokui-backend
docker logs -f zrokui-frontend
```

## 🐳 Production Deployment

### Using GitHub Container Registry (GHCR)

1. **Fork/Clone this repository**

2. **Add GitHub Secrets** (Settings → Secrets → Actions):
   ```
   REDIS_PASSWORD
   JWT_SECRET
   BASE_DOMAIN
   ADMIN_EMAIL
   SMTP_HOST
   SMTP_PORT
   SMTP_USER
   SMTP_PASS
   ```

3. **Push to GitHub** - GitHub Actions will automatically build and push images to GHCR

4. **Deploy on VPS**:
   ```bash
   # Update docker-compose.prod.yml with your GitHub username
   # Then on your VPS:
   
   docker login ghcr.io -u YOUR_GITHUB_USERNAME
   docker compose -f docker-compose.prod.yml up -d
   ```

See [DEPLOY-GHCR.md](DEPLOY-GHCR.md) for detailed deployment instructions.

## 📁 Project Structure

```
zrokui/
├── backend/              # Express API server
│   ├── src/
│   │   ├── index.ts     # Main server
│   │   ├── services/    # Business logic
│   │   └── utils/       # Helper functions
│   └── package.json
│
├── frontend/            # React application
│   ├── src/
│   │   ├── App.tsx      # Main component
│   │   ├── pages/       # Page components
│   │   └── main.tsx     # Entry point
│   └── package.json
│
├── cli/                 # CLI tool
│   └── src/
│       ├── commands/    # CLI commands
│       └── services/    # CLI services
│
└── docker-compose.yml   # Docker configuration
```

## 🔧 Configuration

### Backend Environment Variables

```bash
# Server
PORT=3666
NODE_ENV=development

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password

# JWT
JWT_SECRET=your-secret-key

# Domain
BASE_DOMAIN=localhost

# Admin
ADMIN_EMAIL=admin@example.com
INVITES_ONLY=false
```

### Frontend Configuration

```typescript
// vite.config.ts
server: {
  port: 3555,
  proxy: {
    '/api': 'http://localhost:3666'
  }
}
```

## 📚 Documentation

- [START-LOCAL.md](START-LOCAL.md) - Local development setup
- [DEPLOY-GHCR.md](DEPLOY-GHCR.md) - Production deployment guide
- [PROJECT-PORTS.md](PROJECT-PORTS.md) - Architecture overview

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Redis (ioredis)
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken)
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Charts**: Recharts

### CLI
- **Framework**: Commander.js
- **Styling**: Chalk
- **Spinners**: Ora
- **Config**: Conf

## 🔐 Security

- JWT-based authentication
- bcrypt password hashing
- Redis session management
- Input validation with Zod
- CORS protection
- Rate limiting ready

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies

---

**Note**: This is a self-hosted solution. Make sure to change all default passwords and secrets in production!
