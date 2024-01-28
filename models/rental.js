const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = new mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        isGold: { type: Boolean, default: false },
        name: { type: String, required: true, min: 5, max: 50 },
        phone: { type: String, required: true, min: 5, max: 50 },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: { type: String, required: true, min: 5, max: 50, trim: true },
        dailyRentalRate: { type: Number, required: true, min: 0, max: 50 },
      }),
      required: true,
    },
    dateOut: { type: Date, default: new Date() },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
  })
);

const validate = (requestType, rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    dateOut: Joi.date(),
    dateReturned: Joi.date(),
    rentalFee: Joi.number().min(0),
  });

  return schema.tailor(requestType).validate(rental);
};

module.exports = {
  Rental,
  validate,
};
