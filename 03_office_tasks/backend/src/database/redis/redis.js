import Redis from 'ioredis'

let redisClient = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  const config = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('⚠️  Redis: Max retries reached. Running without cache.');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
    enableOfflineQueue: false,
    lazyConnect: true,
  };

  if (process.env.REDIS_PASSWORD) {
    config.password = process.env.REDIS_PASSWORD;
  }

  redisClient = new Redis(config);

  redisClient.on('connect', () => console.log('✅ Redis Connected'));
  redisClient.on('error', (err) => {
    if (!err.message.includes('ECONNREFUSED')) {
      console.error('Redis Error:', err.message);
    }
  });

  return redisClient;
};

const TTL = parseInt(process.env.REDIS_TTL) || 3600;

const redisService = {
  /**
   * Get a value from Redis
   */
  async get(key) {
    try {
      const client = getRedisClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null; // Graceful degradation
    }
  },

  /**
   * Set a value in Redis with optional TTL
   */
  async set(key, value, ttl = TTL) {
    try {
      const client = getRedisClient();
      await client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Delete a key from Redis
   */
  async del(key) {
    try {
      const client = getRedisClient();
      await client.del(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Delete all keys matching a pattern
   */
  async delPattern(pattern) {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if a key exists
   */
  async exists(key) {
    try {
      const client = getRedisClient();
      return await client.exists(key);
    } catch {
      return false;
    }
  },

  // Cache key helpers
  keys: {
    userProfile: (userId) => `user:profile:${userId}`,
    userDependencies: (userId) => `user:deps:${userId}`,
    sessionToken: (userId) => `session:${userId}`,
  },

  connect: () => getRedisClient().connect().catch(() => {}),
};

export default redisService;