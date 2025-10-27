
import config_env from '@/helper/config-env';
import mongoose from 'mongoose';

const mongoURI = config_env.mongodb_uri || '';

export const db_connection = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
