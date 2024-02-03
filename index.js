require('express-async-errors');
const winston = require('winston');
const error = require('./middleware/error');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const debugApp = require('debug')('app');
const debugDB = require('debug')('database');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

winston.add(new winston.transports.File({ filename: 'logfile.log' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => debugApp(`Server listen on port ${PORT}...`));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(morgan('tiny'));
debugApp('Morgan enabled');

app.use(error);

if (!process.env.JWT_PRIVATE_KEY) {
  console.error('jwtPrivateKey is not defined');
  process.exit(1);
}
mongoose
  .connect('mongodb://localhost:9042/vidlyapp?directConnection=true')
  .then(() => debugDB('Connected to Vidly database...'))
  .catch((err) => debugDB(err));
