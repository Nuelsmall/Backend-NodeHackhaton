const express = require('express');
const router = express.Router();
const User = require('../models/user');
// const validateRequest = require('../controller/userController/validateRequest')

// Get all users
router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
router.post('/createUser', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password:req.body.password
    // Set other user properties here
   
  });
  // Validation rules for user creation
  // For example, checking for required fields like name, email, and password

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
