const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    user = await user.save();
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Duplicate email error
      return res.status(400).send('Email already exists.');
    }
    console.error('Mongoose error:', error);
    res.status(500).send('Internal Server Error');
  }

  res.send(user);
});

module.exports = router;
