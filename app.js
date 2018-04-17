var logger = require('./src/utils/winston');
const cluster = require('cluster');
var mongoose = require('mongoose');
var config = require('./config/config');
var StratumPool, PoolConfig = require('./src/stratumpool');
var WebsiteHandler = require('./src/websiteHandler');
//var PoolConfig = require('./src/stratumpool');
var PaymentHandler = require('./src/paymentHandler');
const numCPUs = require('os').cpus().length;

// spawn the worker threads
if(cluster.isMaster) {
    logger.info('Pigeonpool is starting...');
    //startup
    init();
} else {
    switch(process.env.name) {
        case 'combined':
            StartPools(process.env.data[0].data)  //pool was the first object in the data
            logger.info("poolHandler worker has started.");
            StartWebsite(process.env.data[1].data)
            logger.info("websiteHandler worker has started.");
            break;
        case 'poolHandler':
            StartPools(process.env.data);
            logger.info(process.env.name + ' worker has started.');
            break;
        case 'websiteHandler':
            StartWebsite(process.env.data);
            logger.info(process.env.name + ' worker has started.');
            break;
        case 'paymentHandler':
            StartPaymentHandler(process.env.data);
            logger.info(process.env.name + ' worker has started.');
            break;
    }
}


function StartWebsite(data) {
    var website = new WebsiteHandler(config.appPort, logger);
}

function StartPools(configs) {
    //create a new pool from each config
    if(configs != null) {
        for(let i=0; i< configs.length; i++) {
            var pool = new StratumPool(poolConfigs[i]);
        }
    } else {
        logger.info("No pool configs found...");
    }
    
}

function StartPaymentHandler(data) {
    var paymentHandler = new PaymentHandler(data);
}

// start frontend
// start payments
var poolConfigs;

//read the pool configs from the database
function getPoolConfigs() {
    logger.info('Loading pool configs from database...');
    var poolConfigs = [];
    //var MONGODB_URI = 'mongodb://' + config.dbUserBE + ':' + config.dbUserBEPass + '@' + config.dbHost + ':' + config.dbPort + '/' + config.dbName;
    //mongoose.Promise = Promise;
    //mongoose.connect(MONGODB_URI);
    return poolConfigs;
}

function restartWorker(code, signal, worker){
    logger.info('Worker process ${worker.name} (PID: ${process.pid}) had an unexpected error.\n Code: ${code} \n Signal:  ${signal}\n  Attempting to restart...');
    forkWorker(worker);
}

function forkWorker(worker) {
    logger.info('Starting worker process for ' + worker.name + '...');
    var fork = cluster.fork({name: worker.name, data: worker.data});
    fork.on('exit', restartWorker);
    fork.on('message', function(){});
}

function loadPoolConfigs(){

}

function init() {

    // load pool configs
    var poolConfigs = getPoolConfigs();
    logger.info("Retrieved pool configs.  Active pools: ");
    for(let z=0; z< poolConfigs.length; z++){
        logger.info(poolConfigs[z].coin);
    }
    

    // check if config has a specified number of processes to use
    // options are auto (default), or num {of processes}
    var numCores = 1;
    if(config.numProcs === "auto" || config.numProcs > numCPUs) {
        //use max cores
        numCores = numCPUs;
    } else if (config.numProcs > 0 && config.numProcs < numCPUs) {
        // you can only use the total number of cores
        numCores = config.numProcs;
    }

    // we want to start web and payment in their own cores if possible, pools get the remaining cores
    // otherwise payment processor will get it's own and web/pools will be combined
    if(numCores < 3) {
        //web and pools share, processing gets it's own
        forkWorker({name: 'paymentHandler', data: null});
        forkWorker({name: 'combined', data: [{name: 'poolHandler', data: poolConfigs},{name: 'websiteHandler', data: null}]});
    } else if (numCores == 3) {
        forkWorker({name: 'paymentHandler', data: null});
        forkWorker({name: 'poolHandler', data: poolConfigs});
        forkWorker({name: 'websiteHandler', data: null});
    }else if (numCores > 3) {
        forkWorker({name: 'paymentHandler', data: null});
        forkWorker({name: 'websiteHandler', data: null});
        var poolsPerCore = poolConfigs.length / (numCores -2);
        for(let i=2; i<numCores; i++){
            //now we need to determine how many pools per core
            var corePoolConfigs = [];
            for(let j=0; j<poolsPerCore; j++){
                //we wont' always have an even number so we need to check if we've started the last pool
                var index = j + (j*i);
                if(index <= poolConfigs.length){
                    corePoolConfigs.push(poolConfigs[index]);
                }
            }
            //start a new worker for the current core's pools
            forkWorker({name: 'poolHandler', logger: logger, data: corePoolConfigs});
        }
    }
}

