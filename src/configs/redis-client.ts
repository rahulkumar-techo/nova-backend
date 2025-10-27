import config_env from '@/helper/config-env';
import Redis from 'ioredis';


if(!config_env.redis_uri) throw new Error("Redis uri not provided");
const redis = new Redis(config_env.redis_uri||"");

redis.on('connect', () => console.log('🔴 Connected to Redis'));
redis.on('error', (err) => console.error('Redis error', err));

export default redis;