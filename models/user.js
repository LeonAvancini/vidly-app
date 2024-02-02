const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 5, max: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 256,
  },
  password: { type: String, required: true, min: 5, max: 1024 },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = new mongoose.model('User', userSchema);

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
