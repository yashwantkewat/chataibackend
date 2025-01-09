const express = require('express');
const { signupUser, loginUser, updateUser,forgetPassword,resetPassword} = require('../controller/auth');
const { storeResponse, getResponses,getResponseById } = require('../controller/responseController');
const router = express.Router();

// Handle user registration and get user info on the same route
router.post('/register',signupUser)

router.get('/register', (req, res) => {
  res.status(200).json({ msg: 'Registration page loaded successfully' });
});

router.post('/login', loginUser);

router.get('/login', (req, res) => {
  res.status(200).json({ msg: 'Login page  successfully' });
});


router.put('/update/:id', updateUser);

router.post('/forget-password', forgetPassword);
router.get('/forget-password', (req, res) => {
  res.status(200).json({ msg: 'otp generate  successfully' });
});

router.post('/reset-password',resetPassword)

// Route to save AI response
router.post('/response', storeResponse);

// Route to fetch all responses
router.get('/responses', getResponses);

router.get('/responses/:id', getResponses);

module.exports = router;
