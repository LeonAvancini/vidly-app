const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User({
    name: req.body.name,
    email: req.body.email,
  });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashPassword;

  user = await user.save();
  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .send({ name: req.body.name, email: req.body.email });
});

module.exports = router;
