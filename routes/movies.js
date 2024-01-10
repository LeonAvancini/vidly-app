const express = require('express');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const { RequestTypes } = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find();
  return res.send(movies);
});

router.get('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.Delete, req.params);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('Movie not found');

  return res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(RequestTypes.Post, req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send('Invalid genre.');

  let movie = new Movie({
    title: req.body.title,
    genre: { _id: genre._id, type: genre.type },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();

  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.Put, { ...req.params, ...req.body });
  if (error) return res.status(400).send(error.details[0].message);

  let movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('Movie not found');

  let genre;
  genre = await Genre.findById(req.body.genreId);

  movie.title = req.body.title ?? movie.title;
  movie.genre = genre ? { _id: genre._id, type: genre.type } : movie.genre;
  movie.numberInStock = req.body.numberInStock ?? movie.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate ?? movie.dailyRentalRate;

  const result = await movie.save();

  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.Delete, req.params);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res
      .status(403)
      .send('The customer with the given ID was not found.');

  res.send(movie);
});

module.exports = router;
