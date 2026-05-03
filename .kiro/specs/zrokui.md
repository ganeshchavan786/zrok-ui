# zrokui — Kiro Feature Spec

## Overview
zrokui is a self-hosted SaaS tunneling platform built on zrok (Apache 2.0).
Users signup → get API token → use CLI to expose localhost → get public URL.
Exactly like ngrok — but on your own domain.

**Stack:** Node.js + TypeScript (backend), React + Tailwind (frontend, dark theme), Node.js CLI

---

## Architecture
```
CLI (zrokui http 3000)
    → Backend API (Node.js :3001)
        → zrok Controller REST API (:18080)
            → OpenZiti network
                → *.yourdomain.com
```

---

## Requirements (EARS)

**FR-01** WHEN user registers with email+password, THE SYSTEM SHALL create a zrok account and return JWT.
**FR-02** WHEN user creates an API token, THE SYSTEM SHALL return the plaintext token ONCE, store bcrypt hash.
**FR-03** WHEN CLI sends X-ZROKUI-TOKEN header, THE SYSTEM SHALL authenticate via bcrypt token lookup.
**FR-04** WHEN user creates a share, THE SYSTEM SHALL check plan limits before calling zrok API.
**FR-05** WHEN share is created, THE SYSTEM SHALL store session in Redis and return publicUrl + shareToken.
**FR-06** WHEN CLI Ctrl+C fires, THE SYSTEM SHALL call DELETE /api/tunnels/share/:token to close session.
**FR-07** WHEN user reserves a subdomain, THE SYSTEM SHALL call zrok reserved share API with uniqueName.
**FR-08** WHEN admin invites user, THE SYSTEM SHALL send email with invite link via Nodemailer.
**NFR-01** All API responses: { success: boolean, data?: unknown, error?: string }
**NFR-02** No any types in TypeScript — strict mode everywhere.
**NFR-03** All secrets in environment variables only.

---

## Data Models
- **User** — id, email, passwordHash, plan, isAdmin, zrokAccountToken, createdAt
- **ApiToken** — id, userId, name, token (preview), tokenHash (bcrypt), createdAt, lastUsedAt
- **TunnelSession** — id, userId, shareToken, publicUrl, protocol, localPort, backendMode, status
- **ReservedSubdomain** — userId, subdomain, zrokShareToken, frontendEndpoint

---

## Plan Limits
| Feature | Free | Pro | Team |
|---------|------|-----|------|
| Max tunnels | 2 | 10 | 50 |
| Reserved | 1 | 5 | 20 |
| TCP | ✗ | ✓ | ✓ |
| Drive | ✗ | ✓ | ✓ |
| Custom domain | ✗ | ✓ | ✓ |
| Bandwidth/day | 1 GB | 10 GB | 100 GB |

---

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register + create zrok account |
| POST | /api/auth/login | — | Login → JWT |
| GET | /api/auth/me | JWT | Current user |
| POST | /api/auth/invite | JWT+Admin | Send invite email |
| GET | /api/tokens | JWT | List tokens |
| POST | /api/tokens | JWT | Create token (returns plaintext once) |
| DELETE | /api/tokens/:id | JWT | Revoke token |
| GET | /api/tunnels/overview | JWT/Token | zrok overview |
| GET | /api/tunnels/sessions | JWT/Token | Active sessions |
| POST | /api/tunnels/share | JWT/Token | Create share (checks plan) |
| DELETE | /api/tunnels/share/:token | JWT/Token | Delete share |
| GET | /api/tunnels/metrics | JWT | Account bandwidth metrics |
| GET | /api/tunnels/reserved | JWT | List reserved shares |
| POST | /api/tunnels/reserved | JWT/Token | Create reserved share |
| DELETE | /api/tunnels/reserved/:token | JWT/Token | Delete reserved |
| GET | /api/admin/users | JWT+Admin | All users |
| GET | /api/admin/version | JWT+Admin | zrok version |

---

## CLI Commands
```
zrokui login --token <token>       # Auth
zrokui logout                      # Clear config
zrokui whoami                      # Show user
zrokui enable <accountToken>       # Setup zrok env (once per machine)
zrokui http <port>                 # Public HTTP tunnel
zrokui http <port> --subdomain x   # Reserved subdomain
zrokui http <port> --private       # Private share
zrokui tcp <port>                  # TCP tunnel (Pro+)
zrokui drive <path>                # File sharing (Pro+)
zrokui access <shareToken>         # Access private share
zrokui list                        # Active tunnels
zrokui reserve <subdomain>         # Reserve subdomain
zrokui config                      # Show config
```

---

## Frontend Pages
- `/login` — Email + password login (dark theme)
- `/register` — Signup (invite token support)
- `/dashboard` — Stats + active shares + quick start
- `/tunnels` — All shares (public, private, TCP, drive)
- `/tokens` — API token management
- `/reserved` — Reserved subdomains
- `/metrics` — Bandwidth + request charts (Recharts)
- `/admin/users` — User list + invite

---

## Implementation Phases

### Phase 1 — Backend Core
- [ ] User register/login (creates zrok account)
- [ ] JWT + API token auth middleware
- [ ] Redis utils (getRedis, closeRedis)
- [ ] Plan limits service
- [ ] Token CRUD routes

### Phase 2 — Tunnel Routes
- [ ] POST /api/tunnels/share (with plan check)
- [ ] DELETE /api/tunnels/share/:token
- [ ] GET /api/tunnels/overview (proxy to zrok)
- [ ] GET /api/tunnels/metrics
- [ ] Reserved share CRUD

### Phase 3 — Frontend
- [ ] Login + Register pages
- [ ] Sidebar with all nav items
- [ ] Dashboard (stats + active shares)
- [ ] Tunnels page (all share types)
- [ ] API Tokens page (plaintext shown once)
- [ ] Reserved subdomains page
- [ ] Metrics page (Recharts area charts)
- [ ] Admin users + invite

### Phase 4 — CLI
- [ ] login, logout, whoami, config
- [ ] enable (zrok environment setup)
- [ ] http (public + reserved + private)
- [ ] tcp, drive, access, list, reserve

### Phase 5 — Ops
- [ ] Backend + Frontend Dockerfiles
- [ ] docker-compose.yml
- [ ] Nginx wildcard config
- [ ] bootstrap.sh (one-command setup)
- [ ] Email invite via Nodemailer
