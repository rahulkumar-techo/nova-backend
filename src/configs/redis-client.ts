import Redis from 'ioredis';


const redis = new Redis("rediss://default:ATmMAAIncDJiNjAzMWQzNWI4YzI0MDhmOTgyYTZjYzRmOWJjYzZlNHAyMTQ3MzI@fluent-goat-14732.upstash.io:6379");

redis.on('connect', () => console.log('🔴 Connected to Redis'));
redis.on('error', (err) => console.error('Redis error', err));

export default redis;