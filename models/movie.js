const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');
const { isValidId } = require('../utils');

const Movie = new mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: { type: String, required: true, min: 5, max: 50, trim: true },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 50 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 50 },
  })
);

const validate = (requestType, movie) => {
  const schema = Joi.object({
    id: Joi.string().custom((value, helpers) => {
      if (!isValidId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    title: Joi.string()
      .min(5)
      .max(50)
      .alter({
        post: (schema) => schema.required(),
      }),
    genreId: Joi.string()
      .custom((value, helpers) => {
        if (!isValidId(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .alter({
        post: (schema) => schema.required(),
      }),
    numberInStock: Joi.number()
      .min(0)
      .alter({
        post: (schema) => schema.required(),
      }),
    dailyRentalRate: Joi.number()
      .min(0)
      .alter({
        post: (schema) => schema.required(),
      }),
  });

  return schema.tailor(requestType).validate(movie);
};

module.exports = {
  Movie,
  validate,
};
