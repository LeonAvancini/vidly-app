const express = require('express');
const { Genre, validate } = require('../models/genre');
const { RequestTypes } = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await Genre.find();
  return res.send(result);
});

router.get('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.Get, req.params);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(genre);
});

router.post('/', async (req, res) => {
  const { error } = validate(RequestTypes.Post, req.body);
  if (error) return res.status(400).send(error.message);

  let genre = new Genre({
    type: req.body.type,
  });

  const result = await genre.save();
  res.send(result);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.Put, { ...req.params, ...req.body });
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { type: req.body.type },
    { new: true }
  );

  if (!genre) return res.status(404).send('genre not found.');

  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.Delete, req.params);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) return res.status(404).send('genre not found.');
  res.send(genre);
});

module.exports = router;
