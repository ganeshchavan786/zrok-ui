// backend/src/services/redisService.ts
import Redis from 'ioredis';

class RedisService {
  private client: Redis | null = null;
  private inMemoryStore: Map<string, string> = new Map();
  private useInMemory: boolean = false;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const redisHost = process.env.REDIS_HOST || 'localhost';
      const redisPort = parseInt(process.env.REDIS_PORT || '6379');
      const redisPassword = process.env.REDIS_PASSWORD;

      this.client = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.warn('⚠️  Redis connection failed. Falling back to in-memory storage.');
            this.useInMemory = true;
            return null; // Stop retrying
          }
          return Math.min(times * 100, 2000);
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on('connect', () => {
        console.log('✓ Redis connected successfully');
        this.useInMemory = false;
      });

      this.client.on('error', (err: Error) => {
        if (!this.useInMemory) {
          console.warn('⚠️  Redis error:', err.message);
          console.warn('⚠️  Falling back to in-memory storage');
          this.useInMemory = true;
        }
      });

      this.client.on('close', () => {
        if (!this.useInMemory) {
          console.warn('⚠️  Redis connection closed. Using in-memory storage.');
          this.useInMemory = true;
        }
      });
    } catch (err) {
      console.error('❌ Redis initialization failed:', err);
      console.warn('⚠️  Using in-memory storage');
      this.useInMemory = true;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useInMemory || !this.client) {
      return this.inMemoryStore.get(key) || null;
    }

    try {
      return await this.client.get(key);
    } catch (err) {
      console.warn('⚠️  Redis GET failed, using in-memory fallback');
      this.useInMemory = true;
      return this.inMemoryStore.get(key) || null;
    }
  }

  async set(key: string, value: string, expiryMode?: string, time?: number): Promise<void> {
    if (this.useInMemory || !this.client) {
      this.inMemoryStore.set(key, value);
      if (expiryMode === 'EX' && time) {
        setTimeout(() => this.inMemoryStore.delete(key), time * 1000);
      }
      return;
    }

    try {
      if (expiryMode === 'EX' && time) {
        await this.client.set(key, value, 'EX', time);
      } else {
        await this.client.set(key, value);
      }
    } catch (err) {
      console.warn('⚠️  Redis SET failed, using in-memory fallback');
      this.useInMemory = true;
      this.inMemoryStore.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (this.useInMemory || !this.client) {
      this.inMemoryStore.delete(key);
      return;
    }

    try {
      await this.client.del(key);
    } catch (err) {
      console.warn('⚠️  Redis DEL failed, using in-memory fallback');
      this.useInMemory = true;
      this.inMemoryStore.delete(key);
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (this.useInMemory || !this.client) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return Array.from(this.inMemoryStore.keys()).filter(key => regex.test(key));
    }

    try {
      return await this.client.keys(pattern);
    } catch (err) {
      console.warn('⚠️  Redis KEYS failed, using in-memory fallback');
      this.useInMemory = true;
      const regex = new RegExp(pattern.replace('*', '.*'));
      return Array.from(this.inMemoryStore.keys()).filter(key => regex.test(key));
    }
  }

  isUsingInMemory(): boolean {
    return this.useInMemory;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}

// Export singleton instance
export const redis = new RedisService();
