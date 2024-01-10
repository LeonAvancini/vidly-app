const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  type: {
    type: String,
    require: true,
    minLength: 3,
  },
});

const Genre = new mongoose.model('Genre', genreSchema);

const validate = (genre) => {
  const schema = Joi.object({
    type: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
};

module.exports = {
  Genre,
  genreSchema,
  validate,
};
