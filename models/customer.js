const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = new mongoose.model(
  'Customer',
  new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: { type: String, required: true, min: 5, max: 50 },
    phone: { type: String, required: true, min: 5, max: 50 },
  })
);

const validate = (requestType, customer) => {
  const schema = Joi.object({
    id: Joi.objectId().alter({
      get: (schema) => schema.required(),
      put: (schema) => schema.required(),
      delete: (schema) => schema.required(),
    }),
    isGold: Joi.boolean(),
    name: Joi.string()
      .min(5)
      .max(50)
      .alter({
        post: (schema) => schema.required(),
      }),
    phone: Joi.string()
      .min(5)
      .max(50)
      .alter({
        post: (schema) => schema.required(),
      }),
  });

  return schema.tailor(requestType).validate(customer);
};

module.exports = {
  Customer,
  validate,
};
