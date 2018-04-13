var stratumPool = require('stratum-pool');
var mongoClient = require('mongodb').MongoClient;
var config = require('./config/config.js');
var appRoot = require('app-root-path');
var morgan = require('morgan');
var logger = require('./config/winston');

var _this = this;




//definitions
var poolConfigs = [];


// get the active pool configs from mongo
function getPoolConfigs() {
    var query = config.connectDbfind({"enabled" : true});

    configs.map
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


function startPools() {
    // Stratum.createPool takes two params: poolOptions, authentication method
    //var pool = Stratum.createPool(poolOptions, authenticate);
}

function startWeb() {

}


