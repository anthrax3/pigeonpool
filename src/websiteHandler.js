const internalIp = require('internal-ip');
const express = require('express');
const path = require('path');

//we really need to add webpack so we can have hot reloading

function WebsiteHandler(appPort, logger) {
  const app = express();

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './www/index.html'), {}, function pathError(error){
      if(error) {
        logger.error('Error getting file: ' + error.toString())
      } else {
        //we should do some actually logging (client ip, requested url, etc)
        //logger.info('Served page ')
      }
    });
  });

  
  const port = (appPort == null || isNaN(appPort)) ? 8080 : appPort;
  const ip = internalIp.v4();

  //start on the supplied port, or 8080 if something went wrong
  app.listen(appPort, function(err){
    if (err) {
      logger.error(err);
      return;
    }

    logger.info(' --------------------------------------');
    logger.info(`    Local: http://0.0.0.0:${port}`);
    logger.info(` External: http://${ip}:${port}`);
    logger.info(' --------------------------------------');
  })
  
}

module.exports = WebsiteHandler;