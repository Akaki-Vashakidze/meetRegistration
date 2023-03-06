const express = require('express');
const router = express.Router();
const registrationControllers = require('../controllers/registration')

router.post('/actcodes', registrationControllers.addActcodes)

router.post('/register', registrationControllers.registration)

module.exports = router;