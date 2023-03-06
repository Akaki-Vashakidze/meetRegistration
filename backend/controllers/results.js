
const Results = require('../models/results')


exports.getResults = async (req, res) => {
    try {
        Results.find().then((result) => {
            res.json(result)
        })
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
}

exports.getEventResults = async (req, res) => {
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
}

exports.getMeetResults = async (req, res) => {
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
}
