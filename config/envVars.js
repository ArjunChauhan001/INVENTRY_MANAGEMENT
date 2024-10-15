const dotenv = require('dotenv');

dotenv.config();

const ENV_VARS = {
    MONGODB_URI : process.env.MONGODB_URI,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
}

module.exports = ENV_VARS 