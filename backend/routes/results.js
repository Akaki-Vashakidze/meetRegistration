const express = require('express');
const router = express.Router();
const Results = require('../models/results')
const jwt = require('jsonwebtoken')

router.post('/meetResults', async (req, res) => {
    try {
        let foundMeet;
        await Results.find().then((results) => {
            foundMeet = results.find((item) => {
                return item.nameYear == req.body.meetName
            })
        })
        res.send(foundMeet)
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})

router.post('/eventResults', async (req, res) => {
    try {
        let foundMeet;
        let foundEvent;
        await Results.find().then((results) => {
            foundMeet = results.find((item) => {
                return item.nameYear == req.body.meetName
            })
        })

        foundEvent = await foundMeet.meetInfo.find((item) => {
            return item.event == req.body.eventName && item.gender == req.body.gender
        })
        res.send(foundEvent)
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})

router.post('/swimmerCardInfo', async (req, res) => {
    let style = req.body.style;
    style == 'ბატერფლაი' ? style = 'ბატ.' : style = style;
    style == 'თავისუფალი ყაიდა' ? style = 'თ/ყ' : style = style;
    style == 'გულაღმა ცურვა' ? style = 'გ/ც' : style = style;
    let event = req.body.distance + ' ' + style;
    let swimmerFullName = req.body.lastname + ' ' + req.body.name;
    let poolSize = req.body.poolSize
    let meetInformation;
    try {
        await Results.find()
            .then(item => {
                let array = []
                for (let i = 0; i < item.length; i++) {
                    if (item[i].course == poolSize) {
                        for (let j = 0; j < item[i].meetInfo.length; j++) {
                            array.push(item[i].meetInfo[j])
                        }
                    }
                }
                return array
            })
            .then(item => {
                let filteredEvents
                for (let i = 0; i < item.length; i++) {
                    filteredEvents = item.filter(info => {
                        return info.event == event
                    })
                }
                return filteredEvents;
            })
            .then(item => {
                let eventsAllResults = [];
                for (let i = 0; i < item.length; i++) {
                    for (let j = 0; j < item[i].results.length; j++) {
                        eventsAllResults.push(item[i].results[j])
                    }
                }
                return eventsAllResults
            })
            .then(item => {
                let searchedSwimmerAllEvents;
                searchedSwimmerAllEvents = item.filter(info => {
                    return info.name == swimmerFullName;
                })
                return searchedSwimmerAllEvents;
            })
            .then(item => {
                // პუოლობს ყველაზე კარგ შედეგს;
                let swimmerBestTime = item.reduce(function (prev, current) {
                    return (prev.resultForSort < current.resultForSort) ? prev : current
                })
                return swimmerBestTime;
            })
            .then(async item => {
                // აქ იღებ ინფორმაციას მცურავეზე - კაცია თუ ქალი;
                let hh = await Results.find({ "meetInfo.results": { $elemMatch: { name: swimmerFullName } } })
                for (let i = 0; i < hh.length; i++) {
                    for (let j = 0; j < hh[i].meetInfo.length; j++) {
                        for (let k = 0; k < hh[i].meetInfo[j].results.length; k++) {
                            if (hh[i].meetInfo[j].results[k].name == swimmerFullName) {
                                return { ...item, gender: hh[i].meetInfo[j].gender,compInfo:req.body.compInfo}
                            }
                        }
                    }
                }
            })
            .then(item => {
                res.send(item)
            })

    }
    catch (error) {
        console.log(error)
        res.status(500).send("something went wrong")
    }
})



router.get('/results', verifyToken, async (req, res) => {
    try {
        Results.find().then((result) => {
            res.json(result)
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