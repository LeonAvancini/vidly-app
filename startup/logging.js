require('express-async-errors');
const winston = require('winston');
const error = require('../middleware/error');
require('winston-mongodb');

module.exports = function () {
  process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  winston.add(
    new winston.transports.File({ filename: 'logfile.log', level: error })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost:9042/vidlyapp?directConnection=true',
      level: 'error',
    })
  );
};
