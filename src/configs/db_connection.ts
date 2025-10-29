
import config_env from '@/configs/config-env';
import { log } from '@/shared/utils/logger';
import mongoose from 'mongoose';

const mongoURI = config_env.mongodb_uri || '';

export const db_connection = async () => {
    try {
        await mongoose.connect(mongoURI);
        log.info('💽 Connected to MongoDB successfully');
    } catch (error) {
        log.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
