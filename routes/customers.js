const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');
const { RequestTypes } = require('../utils');

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const { error } = validate(RequestTypes.get, req.params);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(RequestTypes.Post, req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(RequestTypes.Put, { ...req.params, ...req.body });
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer) {
    return res.status(404).send('Customer not found');
  }

  res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
  const { error } = validate(RequestTypes.delete, req.params);
  if (error) return res.status(400).send(error.message);
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res
      .status(403)
      .send('The customer with the given ID was not found.');
  res.send(customer);
});

module.exports = router;
