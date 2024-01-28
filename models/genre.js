const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    minLength: 3,
  },
});

const Genre = new mongoose.model('Genre', genreSchema);

const validate = (requestType, genre) => {
  const schema = Joi.object({
    id: Joi.objectId().alter({
      get: (schema) => schema.required(),
      put: (schema) => schema.required(),
      delete: (schema) => schema.required(),
    }),
    type: Joi.string()
      .min(3)
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.required(),
      }),
  });

  return schema.tailor(requestType).validate(genre);
};

module.exports = {
  Genre,
  genreSchema,
  validate,
};
