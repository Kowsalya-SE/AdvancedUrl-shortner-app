const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

router.post('/auth/google',authController.login)  
module.exports = router;
