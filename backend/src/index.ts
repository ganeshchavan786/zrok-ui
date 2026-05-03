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
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    services: {
      redis: redis.isUsingInMemory() ? 'in-memory' : 'connected',
      zrok: 'unknown',
    },
    version: '1.0.0',
  };

  // Test zrok controller (if configured)
  if (env.ZROK_API_URL) {
    try {
      const axios = require('axios');
      await axios.get(`${env.ZROK_API_URL}/api/v1/version`, {
        timeout: 2000,
      });
      health.services.zrok = 'connected';
    } catch (error) {
      health.services.zrok = 'disconnected';
      health.status = 'degraded';
    }
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
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
