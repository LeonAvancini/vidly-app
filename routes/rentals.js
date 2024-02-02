const express = require('express');

const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { RequestTypes } = require('../utils');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find();

  return res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(RequestTypes.Post, req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Invalid customer.');

  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Invalid movie.');

  if (!movie.numberInStock)
    return res.status(404).send('This movie is not in stock.');

  let rental = new Rental({
    customer: {
      isGold: customer.isGold,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    dateOut: req.body.dateOut,
    dateReturned: req.body.dateReturned,
    rentalFee: req.body.rentalFee,
  });

  movie.numberInStock = movie.numberInStock - 1;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await movie.save({ session });
      rental = await rental.save({ session });
      res.send(rental);
    });
  } catch (error) {
    console.error('Transaction error:', error);
    return res.status(400).send('Something failed');
  } finally {
    session.endSession();
  }
});

module.exports = router;
