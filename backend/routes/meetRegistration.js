const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const RegistrationInfo = require('../models/registeredSwimmers')
const Results = require('../models/results')

router.post('/registerSwimmers',verifyToken, async (req,res) => {
    try {
        let registrationInfo = new RegistrationInfo(req.body)
        registrationInfo.save((error, registeredInfo) => {
            res.status(200).send({
               registeredInfo
            })
        })
    }
    catch {
         res.status(500).send("something went wrong")
    }
})

router.get('/names', verifyToken, async (req, res) => {
    try {
        Results.find({}, { meetInfo: 1 })
            .then((item) => {
                let allResults = []
                item.map(item => {
                    for (let i = 0; i < item.meetInfo.length; i++) {
                        allResults.push(item.meetInfo[i])
                    }
                })
                return allResults
            })
            .then(item => {
                let allNameArr = [];
                for (let i = 0; i < item.length; i++) {
                    if (item[i].results) {
                        for (let j = 0; j < item[i].results.length; j++) {
                            allNameArr.push(item[i].results[j])
                        }
                    }
                }
                return allNameArr;
            })
            .then(item => {
                let names = item.map(item => {
                    return item.name
                })
                return names;
            })
            .then(item => {
                res.send(item)
            })
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})

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