const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// POST a new user
router.post('/signup', userController.signupUser);

// POST sign in user
router.post('/signin', userController.signInUser);

module.exports = router;
