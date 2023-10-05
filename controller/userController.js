const express = require('express');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { generateToken } = require('./jwtUtils'); // Create a separate module for JWT token generation

const app = express();
app.use(express.json());

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // validate request using express-validator
  const validateRequest = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {

      return res.status(400).json({ errors: error.array()});
  }
  next();
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = generateToken(user._id);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // validate request using express-validator
  const error = validationResult(req);
  if (!error.isEmpty()) {
    returnres.status(400).json({ errors: error.array()});
  };

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  validateRequest
};
