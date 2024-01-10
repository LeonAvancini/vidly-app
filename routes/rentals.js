const express = require('express');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { RequestTypes } = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = Rental.find();
  console.log('rentals', rentals);
  return res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(RequestTypes.Post, req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Invalid customer.');

  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Invalid movie.');

  if (!movie.numberInStock)
    return res.status(404).send('This movie is not in stock.');

  movie.numberInStock = movie.numberInStock - 1;

  let rental = new Rental({
    customer: customer,
    movie: movie,
    dateOut: req.body.dateOut,
    dateReturned: req.body.dateReturned,
    rentalFee: req.body.rentalFee,
  });

  await movie.save();
  rental = await rental.save();

  res.send(rental);
});

module.exports = router;
