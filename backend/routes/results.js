const express = require('express');
const router = express.Router();
const resultsControllers = require('../controllers/results')
const jwt = require('jsonwebtoken')

router.post('/meetResults', resultsControllers.getMeetResults)

router.post('/eventResults', resultsControllers.getEventResults)

router.get('/results', verifyToken, resultsControllers.getResults)

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