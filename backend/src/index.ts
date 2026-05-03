import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import tokenRoutes from './routes/tokens';
import tunnelRoutes from './routes/tunnels';
import { redis } from './services/redisService';
import { env, isProduction } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'zrokui backend is running', 
    port: PORT,
    redis: redis.isUsingInMemory() ? 'in-memory' : 'connected',
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Token routes
app.use('/api/tokens', tokenRoutes);

// Tunnel routes
app.use('/api/tunnels', tunnelRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${env.NODE_ENV}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Redis: ${redis.isUsingInMemory() ? '⚠️  In-memory mode (Redis not available)' : '✓ Connected'}`);
  if (env.ZROK_API_URL) {
    console.log(`✓ zrok Controller: ${env.ZROK_API_URL}`);
  }
});
