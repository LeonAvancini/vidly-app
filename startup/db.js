const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  mongoose
    .connect('mongodb://localhost:9042/vidlyapp?directConnection=true')
    .then(() => winston.info('Connected to Vidly database...'));
};
