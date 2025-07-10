const redis = require('redis');

// Configuração do Redis
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.log('Redis connection refused, retrying...');
      return Math.min(options.attempt * 100, 3000);
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

client.on('connect', () => {
  console.log('✅ Connected to Redis');
});

client.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

client.on('ready', () => {
  console.log('✅ Redis is ready');
});

client.on('reconnecting', () => {
  console.log('🔄 Reconnecting to Redis...');
});

module.exports = client;