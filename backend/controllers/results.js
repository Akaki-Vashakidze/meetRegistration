
const CompResults = require('../models/compResults')

exports.getResults = async (req, res) => {
    try {
        CompResults.find()
        .select({'date':1,'meetName':1,'course':1})
        .then((result) => {
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
        await CompResults.find().select({'results':1})
           .then((results) => {
            foundMeet = results.find((item) => {
                return item._id == req.body.meetID
            })
            return foundMeet.results
        }) .then(item => {
            let eventResults = item.filter(info => {
                return info.event == req.body.eventName && info.gender == req.body.gender
            })
            let info = {
                results:eventResults,
                event:req.body.eventName,
                gender:req.body.gender
            }
            res.send(info)
        })
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
}

exports.getMeetResults = async (req, res) => {
    try {
        let foundMeet;
        await CompResults.find()
        .select({'results':1})
        .then((results) => {
            foundMeet = results.find((item) => {
                return item._id == req.body.meetId
            })
            return foundMeet.results
        })
        .then(item => {
         let events = item.map(info => {
            return info.event + ' ' + info.gender
          })
          return events
        })
        .then(item => {
            let filteredEvents = [...new Set(item)]
            return filteredEvents
        })
        .then(item => {
            res.send(item)
        })
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
}
