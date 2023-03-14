const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const meetRegistrationConrollers = require('../controllers/meetRegistration')

router.post('/swimmerCardInfo', meetRegistrationConrollers.getSwimmerCardInfo)

router.get('/clubs', meetRegistrationConrollers.getClubs)

router.post('/registerSwimmers',verifyToken, meetRegistrationConrollers.registerSwimmers)

router.get('/names', verifyToken, meetRegistrationConrollers.getNames)

router.get('/newComps', meetRegistrationConrollers.getNewCompsInfo)

router.post('/checkDoubleCompReg', meetRegistrationConrollers.checkDoubleCompReg)

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token == 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }

    req.userId = payload.subject
    next()
}


module.exports = router;