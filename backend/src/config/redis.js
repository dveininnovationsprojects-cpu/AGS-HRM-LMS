// Redis is optional - used for job queues
// If Redis is not available, queues fall back to in-memory
let redis = null;

const getRedis = () => {
  if (!redis && process.env.REDIS_URL) {
    const Redis = require('ioredis');
    redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      retryStrategy: (times) => Math.min(times * 100, 3000),
    });
    redis.on('error', () => { /* silently handle */ });
  }
  return redis;
};

module.exports = { getRedis };
