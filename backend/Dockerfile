FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && mkdir -p logs && chown -R app /app
COPY --from=builder /app/dist ./dist
USER app
EXPOSE 3666
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3666/health || exit 1
CMD ["node", "dist/index.js"]
