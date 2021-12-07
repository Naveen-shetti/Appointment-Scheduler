const dotenv = require('dotenv').config();

export const constants = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/EventScheduler'
};