import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Redis from 'ioredis';
import crypto from 'crypto';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

const createTokenSchema = z.object({
  name: z.string().min(1).max(100),
});

// Get all tokens for user
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    
    // Get token IDs for user
    const tokenIds = await redis.smembers(`user:${email}:tokens`);
    
    // Get token details
    const tokens = await Promise.all(
      tokenIds.map(async (id) => {
        const data = await redis.get(`token:${id}`);
        if (!data) return null;
        const token = JSON.parse(data);
        // Don't return the actual token value
        return {
          id: token.id,
          name: token.name,
          createdAt: token.createdAt,
        };
      })
    );

    res.json({
      success: true,
      data: tokens.filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
});

// Create new token
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = createTokenSchema.parse(req.body);
    const email = (req as any).user.email;

    // Generate token
    const tokenValue = `zrok_${crypto.randomBytes(32).toString('hex')}`;
    const tokenId = crypto.randomBytes(16).toString('hex');

    const token = {
      id: tokenId,
      name,
      token: tokenValue,
      email,
      createdAt: new Date().toISOString(),
    };

    // Store token
    await redis.set(`token:${tokenId}`, JSON.stringify(token));
    await redis.set(`tokenvalue:${tokenValue}`, email);
    await redis.sadd(`user:${email}:tokens`, tokenId);

    res.json({
      success: true,
      data: {
        id: tokenId,
        name,
        token: tokenValue, // Only returned once
        createdAt: token.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message });
    }
    next(err);
  }
});

// Delete token
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const email = (req as any).user.email;

    // Get token
    const tokenData = await redis.get(`token:${id}`);
    if (!tokenData) {
      return res.status(404).json({ success: false, error: 'Token not found' });
    }

    const token = JSON.parse(tokenData);

    // Verify ownership
    if (token.email !== email) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // Delete token
    await redis.del(`token:${id}`);
    await redis.del(`tokenvalue:${token.token}`);
    await redis.srem(`user:${email}:tokens`, id);

    res.json({ success: true, data: { message: 'Token deleted' } });
  } catch (err) {
    next(err);
  }
});

export default router;
