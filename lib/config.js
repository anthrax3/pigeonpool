require('dotenv').config;
const mongoose = require('mongoose');

const env = process.env.NODE_ENV; // 'dev' or 'test'

//read in values from the .env file, otherwise use the defaults supplied
const config = {
    appPort: parseInt(process.env.DEV_APP_PORT) || 3000,
    host: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 27017,
    dbName: process.env.DB_NAME || 'pigeonpool-dev',
    dbUserBE: process.env.DB_USER_BE || 'root',
    dbUserBEPass: process.env.DB_USER_BE_PASS || 'pass',
    dbUserFE: process.env.DB_USER_FE || 'root',
    dbUserFEPass: process.env.DB_USER_FE_PASS || 'pass',
}

module.exports = mongoose;

module.exports = config;