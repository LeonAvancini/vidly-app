const debugApp = require('debug')('app');
const debugDB = require('debug')('database');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const auth = require('./middleware/authenticator');
const app = express();
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => debugApp(`Server listen on port ${PORT}...`));

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use(morgan('tiny'));
debugApp('Morgan enabled');

mongoose
  .connect('mongodb://localhost/vidlyapp')
  .then(() => debugDB('Connected to Vidly database...'))
  .catch((err) => debugDB(err));
