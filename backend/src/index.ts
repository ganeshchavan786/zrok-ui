// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import tokenRoutes from './routes/tokens';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3666;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'zrokui backend is running', port: PORT });
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});
