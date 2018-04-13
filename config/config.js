require('dotenv').config;
var MongoClient = require('mongodb').MongoClient;


const env = process.env.NODE_ENV; // 'dev' or 'test'

//read in values from the .env file, otherwise use the defaults supplied
const config = {
    appPort: parseInt(process.env.DEV_APP_PORT) || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 27017,
    dbName: process.env.DB_NAME || 'pigeonpool-dev',
    dbUserBE: process.env.DB_USER_BE || 'root',
    dbUserBEPass: process.env.DB_USER_BE_PASS || 'pass',
    dbUserFE: process.env.DB_USER_FE || 'root',
    dbUserFEPass: process.env.DB_USER_FE_PASS || 'pass',
}

var mongoUrl = 'mongodb://' + config.dbUserBE + ':' + config.dbUserBEPass + '@' + config.dbHost + ':' + config.dbPort + '/' + config.dbName;

var connectDb = modules.export = function (runFunction, errorFunction) {
    MongoClient.connect(mongoUrl)
        .then(
            function (db) {
                runFunction;
            },
            function(error){
                errorFunction;
            }
        )
        .catch(function (error) {
            
        })
}

//let's get connected
connectDb();

module.exports = mongoose;
module.exports = config;