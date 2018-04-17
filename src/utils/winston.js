var appRoot = require('app-root-path');
var winston = require('winston');


var options = {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
};

  // setup our logger, instantiate our transports
var logger = new winston.Logger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // don't exit on handled exceptions
});

logger.stream = {
    write: function(message, encoding) {
        //use info level
        logger.info(message);
    },
};

module.exports = logger;