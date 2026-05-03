# 🚀 zrokui User Flow - Complete Guide

## 📋 Overview

zrokui works exactly like ngrok - simple, secure tunnel sharing with token-based CLI authentication.

```
┌─────────────────────────────────────────────────────────────┐
│                    USER FLOW                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Sign up on web                                           │
│  2. Create API token                                         │
│  3. Login via CLI with token                                 │
│  4. Create tunnels                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Guide

### STEP 1: Create Account

**Go to**: `http://zrokui.yourdomain.com` (or `http://YOUR_VPS_IP:3555`)

1. Click **"Sign up"**
2. Enter your email
3. Create a password (min 8 characters)
4. Click **"Create account"**

✅ You're automatically logged in!

---

### STEP 2: Create API Token

**Dashboard**: Automatically opens after signup

1. Click **"Create Token"** button
2. Enter token name (e.g., "My Laptop", "Work PC")
3. Click **"Create"**
4. **IMPORTANT**: Copy the token immediately!
   ```
   zrok_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
   ```
5. Token is shown **only once** - save it securely!

---

### STEP 3: Install & Login CLI

**Install CLI** (one-time):
```bash
npm install -g zrokui-cli
```

**Login with token**:
```bash
zrokui login --token zrok_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Expected output**:
```
✓ Logged in as you@example.com
✓ Token saved to ~/.zrokui/config.json
```

---

### STEP 4: Create Tunnels

**HTTP Tunnel**:
```bash
# Share local port 3000
zrokui http 3000

# Output:
✓ Tunnel created!
→ https://abc123.yourdomain.com → http://localhost:3000
```

**TCP Tunnel**:
```bash
# Share SSH server
zrokui tcp 22

# Output:
✓ Tunnel created!
→ tcp://yourdomain.com:12345 → tcp://localhost:22
```

---

## 🔄 Comparison with ngrok

| Feature | ngrok | zrokui |
|---------|-------|--------|
| **Signup** | ngrok.com/signup | zrokui.yourdomain.com/signup |
| **Get Token** | Dashboard → Authtoken | Dashboard → Create Token |
| **CLI Login** | `ngrok config add-authtoken <token>` | `zrokui login --token <token>` |
| **HTTP Tunnel** | `ngrok http 3000` | `zrokui http 3000` |
| **TCP Tunnel** | `ngrok tcp 22` | `zrokui tcp 22` |
| **Dashboard** | ngrok.com/dashboard | zrokui.yourdomain.com/dashboard |

---

## 🎨 UI Screenshots (Flow)

### 1. Login Page
```
┌─────────────────────────────────────────┐
│              ⚡ zrokui                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Sign in to your account           │ │
│  │                                    │ │
│  │  Email: [________________]         │ │
│  │  Password: [________________]      │ │
│  │                                    │ │
│  │  [      Sign in      ]             │ │
│  │                                    │ │
│  │  Don't have an account? Sign up    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. Signup Page
```
┌─────────────────────────────────────────┐
│              ⚡ zrokui                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Create your account               │ │
│  │                                    │ │
│  │  Email: [________________]         │ │
│  │  Password: [________________]      │ │
│  │  Confirm: [________________]       │ │
│  │                                    │ │
│  │  [   Create account   ]            │ │
│  │                                    │ │
│  │  Already have an account? Sign in  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 3. Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  ⚡ zrokui                    you@example.com  [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  API Tokens                                              │
│  Create and manage tokens for CLI authentication        │
│                                                          │
│  [+ Create Token]                                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  My Laptop                              [Delete]   │ │
│  │  Created Jan 15, 2026                              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Work PC                                [Delete]   │ │
│  │  Created Jan 10, 2026                              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 4. Create Token Modal
```
┌─────────────────────────────────────────┐
│  Create API Token                        │
│                                          │
│  Token name:                             │
│  [My Laptop________________]             │
│                                          │
│  [Cancel]  [Create]                      │
└─────────────────────────────────────────┘

After creation:

┌─────────────────────────────────────────┐
│  Token Created!                          │
│                                          │
│  Copy this token now. You won't be      │
│  able to see it again!                   │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ zrok_a1b2c3d4e5f6g7h8i9j0...       ││
│  └─────────────────────────────────────┘│
│                                          │
│  [📋 Copy Token]                         │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Features

### Token Management
- ✅ Tokens shown **only once** during creation
- ✅ Secure storage in Redis
- ✅ bcrypt password hashing
- ✅ JWT-based authentication
- ✅ Token revocation (delete anytime)

### Best Practices
- Create separate tokens for each device
- Delete tokens you no longer use
- Never share your tokens
- Use strong passwords (8+ characters)

---

## 💻 CLI Commands

### Authentication
```bash
# Login with token
zrokui login --token <your-token>

# Check login status
zrokui whoami

# Logout
zrokui logout
```

### Tunnels
```bash
# HTTP tunnel
zrokui http 3000
zrokui http 8080 --subdomain myapp

# TCP tunnel
zrokui tcp 22
zrokui tcp 3306

# List active tunnels
zrokui list

# Stop tunnel
zrokui stop <tunnel-id>
```

---

## 🌐 Access URLs

### Development (Local)
```
Frontend:  http://localhost:3555
Backend:   http://localhost:3666
```

### Production (VPS)
```
Frontend:  http://YOUR_VPS_IP:3555
Backend:   http://YOUR_VPS_IP:3666
```

### With Domain
```
Frontend:  https://zrokui.yourdomain.com
Backend:   https://api.yourdomain.com
```

---

## 🚀 Quick Start (Complete Flow)

```bash
# 1. Open browser
open http://YOUR_VPS_IP:3555

# 2. Sign up
# - Enter email & password
# - Click "Create account"

# 3. Create token
# - Click "Create Token"
# - Name it "My Laptop"
# - Copy the token

# 4. Install CLI
npm install -g zrokui-cli

# 5. Login
zrokui login --token zrok_your_token_here

# 6. Create tunnel
zrokui http 3000

# 7. Share the URL!
# https://abc123.yourdomain.com
```

---

## 🎯 Use Cases

### Web Development
```bash
# Share local dev server
cd my-project
npm run dev  # Runs on port 3000
zrokui http 3000

# Share with client:
# "Check out the demo at https://abc123.yourdomain.com"
```

### API Testing
```bash
# Share local API
zrokui http 8080

# Webhook testing:
# Set webhook URL to https://xyz789.yourdomain.com/webhook
```

### SSH Access
```bash
# Share SSH server
zrokui tcp 22

# Connect from anywhere:
# ssh user@yourdomain.com -p 12345
```

### Database Access
```bash
# Share MySQL
zrokui tcp 3306

# Connect remotely:
# mysql -h yourdomain.com -P 12346 -u user -p
```

---

## 📊 Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. CREATE                                               │
│     Dashboard → Create Token → Copy                      │
│     ↓                                                    │
│  2. SAVE                                                 │
│     Store securely (password manager)                    │
│     ↓                                                    │
│  3. USE                                                  │
│     zrokui login --token <token>                         │
│     ↓                                                    │
│  4. ACTIVE                                               │
│     Create tunnels, manage shares                        │
│     ↓                                                    │
│  5. REVOKE (optional)                                    │
│     Dashboard → Delete Token                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Can't login to dashboard
- Check backend is running: `curl http://localhost:3666/health`
- Check Redis is running: `docker ps | grep redis`
- Clear browser cache and try again

### Token not working in CLI
- Make sure you copied the full token
- Token format: `zrok_` followed by 64 hex characters
- Try creating a new token

### Tunnel not accessible
- Check firewall allows the port
- Verify tunnel is active: `zrokui list`
- Check backend logs: `docker logs zrokui-backend`

---

## 📚 Related Documentation

- **START-LOCAL.md** - Local development setup
- **VPS-DEPLOYMENT.md** - Production deployment
- **PORT-SUMMARY.md** - Port configuration
- **QUICK-REFERENCE.md** - Command reference

---

## 🎉 Success Indicators

You know it's working when:

1. ✅ Can signup and login on web
2. ✅ Can create API tokens
3. ✅ CLI login succeeds
4. ✅ Can create tunnels
5. ✅ Tunnels are accessible from internet

---

**Repository**: https://github.com/ganeshchavan786/zrok-ui

**Exactly like ngrok, but self-hosted!** 🚀
