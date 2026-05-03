# zrokui — Kiro Steering Rules

## Stack
- Backend: Node.js + TypeScript + Express + Redis (ioredis) + zod
- Frontend: React 18 + TypeScript + Tailwind CSS (dark theme, zinc palette)
- CLI: Node.js + TypeScript + commander + chalk + ora + conf

## TypeScript Rules
- strict: true — no any types anywhere
- All async functions use async/await
- All errors caught and passed to next() in Express
- API responses always: { success: boolean, data?: unknown, error?: string }
- Use zod for all request body validation

## Naming
- Files: camelCase.ts
- Components: PascalCase.tsx
- Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE

## UI Rules
- Dark theme only: zinc-950 background, zinc-900 cards, zinc-800 borders
- Accent color: violet-600 (buttons), violet-400 (links/active nav)
- No white backgrounds anywhere
- Tailwind only — no inline styles, no CSS modules
- All icons from lucide-react

## Security
- Never log tokens or passwords
- All secrets from process.env only
- Sanitize all user input before shell commands
- bcrypt for token hashing (rounds: 10)

## Error Handling
- AppError class with statusCode
- Global Express error handler
- CLI: print chalk.red error, exit(1)
