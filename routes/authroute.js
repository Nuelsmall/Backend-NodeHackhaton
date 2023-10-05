const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const validateRequest = require('./validateRequest'); // Import the validation middleware
const User = require('../models/user'); // Import your User model

// POST route for user signup
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  validationResult,
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Create a new user
      const user = new User({ name, email, password });
      await user.save();

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);


// POST route for user login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if the password is correct (you should use a secure authentication mechanism)
      if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Authentication successful
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
