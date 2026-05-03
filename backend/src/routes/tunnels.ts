import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth';
import { zrokAccountMetrics, zrokShareMetrics, zrokListShares, zrokCreateShare, zrokDeleteShare } from '../services/zrokApi';
import { redis } from '../services/redisService';

const router = Router();

// Get account metrics
router.get('/metrics', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    
    // Get user's zrok token from Redis
    const userData = await redis.get(`user:${email}`);
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = JSON.parse(userData);
    const zrokToken = user.zrokToken;

    if (!zrokToken) {
      // Return empty metrics if no zrok token
      return res.json({
        success: true,
        data: { periods: [] },
      });
    }

    // Fetch metrics from zrok controller
    const metrics = await zrokAccountMetrics(zrokToken);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (err) {
    next(err);
  }
});

// Get share-specific metrics
router.get('/metrics/:shareToken', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    const { shareToken } = req.params;
    
    // Get user's zrok token
    const userData = await redis.get(`user:${email}`);
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = JSON.parse(userData);
    const zrokToken = user.zrokToken;

    if (!zrokToken) {
      return res.json({
        success: true,
        data: { periods: [] },
      });
    }

    // Fetch share metrics from zrok controller
    const metrics = await zrokShareMetrics(zrokToken, shareToken);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (err) {
    next(err);
  }
});

// List all tunnels/shares
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    
    // Get user's zrok token
    const userData = await redis.get(`user:${email}`);
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = JSON.parse(userData);
    const zrokToken = user.zrokToken;

    if (!zrokToken) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Fetch shares from zrok controller
    const shares = await zrokListShares(zrokToken);

    res.json({
      success: true,
      data: shares,
    });
  } catch (err) {
    next(err);
  }
});

// Create new tunnel/share
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    const shareData = req.body;
    
    // Get user's zrok token
    const userData = await redis.get(`user:${email}`);
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = JSON.parse(userData);
    const zrokToken = user.zrokToken;

    if (!zrokToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'No zrok account enabled. Please enable zrok first.' 
      });
    }

    // Create share in zrok controller
    const share = await zrokCreateShare(zrokToken, shareData);

    res.json({
      success: true,
      data: share,
    });
  } catch (err: any) {
    if (err.response?.data) {
      return res.status(err.response.status || 500).json({
        success: false,
        error: err.response.data.error || 'Failed to create tunnel',
      });
    }
    next(err);
  }
});

// Delete tunnel/share
router.delete('/:shareToken', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    const { shareToken } = req.params;
    
    // Get user's zrok token
    const userData = await redis.get(`user:${email}`);
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = JSON.parse(userData);
    const zrokToken = user.zrokToken;

    if (!zrokToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'No zrok account enabled' 
      });
    }

    // Delete share from zrok controller
    await zrokDeleteShare(zrokToken, shareToken);

    res.json({
      success: true,
      data: { message: 'Tunnel deleted successfully' },
    });
  } catch (err: any) {
    if (err.response?.data) {
      return res.status(err.response.status || 500).json({
        success: false,
        error: err.response.data.error || 'Failed to delete tunnel',
      });
    }
    next(err);
  }
});

export default router;
