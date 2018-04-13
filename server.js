var stratumPool = require('stratum-pool');
var mongoClient = require('mongodb').MongoClient;
var config = require('./lib/config.js');
var _this = this;

// get the active pool configs from mongo
function getPoolConfigs() {

}


// This is the authorize function. Connect this to the database in your code to check if the client is valid
// basic auth method,  this needs to be more real
function authenticate(ip, port , workerName, password, callback) {
    console.log("Authorize " + workerName + ":" + password + "@" + ip);
    callback({
        error: null,
        authorized: true,
        disconnect: false
    });
}

// Stratum.createPool takes two params: poolOptions, authentication method
var pool = Stratum.createPool(poolOptions, authenticate);