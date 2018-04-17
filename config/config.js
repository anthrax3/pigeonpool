require('dotenv').config;

//read in values from the .env file, otherwise use the defaults supplied
const config = {
    numProcs: process.env.DB_HOST || '2',
    appPort: parseInt(process.env.APP_PORT) || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 27017,
    dbName: process.env.DB_NAME || 'pigeonpool-dev',
    dbUserBE: process.env.DB_USER_BE || 'root',
    dbUserBEPass: process.env.DB_USER_BE_PASS || 'pass',
    dbUserFE: process.env.DB_USER_FE || 'root',
    dbUserFEPass: process.env.DB_USER_FE_PASS || 'pass',
}

// connection string
// mongoUrl = 'mongodb://' + config.dbUserBE + ':' + config.dbUserBEPass + '@' + config.dbHost + ':' + config.dbPort + '/' + config.dbName;

module.exports = config;