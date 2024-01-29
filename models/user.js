const mongoose = require('mongoose');
const Joi = require('joi');

const User = new mongoose.model(
  'User',
  new mongoose.Schema({
    name: { type: String, required: true, min: 5, max: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, min: 5, max: 50 },
  })
);

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().required().min(5).max(50),
  });

  return schema.validate(user);
};

module.exports = {
  User,
  validate,
};
