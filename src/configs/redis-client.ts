import config_env from '@/configs/config-env';
import { log } from '@/shared/utils/logger';
import Redis from 'ioredis';


if(!config_env.redis_uri) throw new Error("Redis uri not provided");
const redis = new Redis(config_env.redis_uri||"");

redis.on('connect', () => log.info('🔴 Connected to Redis'));
redis.on('error', (err) => log.error('Redis error', err));

export default redis;