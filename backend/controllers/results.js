
const Results = require('../models/results')
const Events = require('../models/events')
const CompResults = require('../models/compResults')
const Meets = require('../models/meets')
const compResults = require('../models/compResults')

exports.getResults = async (req, res) => {
    try {
        CompResults.find()
        .select({'date':1,'meetName':1,'course':1})
        .then((result) => {
            res.json(result)
            // let array = [];
            // let mainAarray = [];
            // for(let i = 0;i<result.length;i++) {
            //     if(result[i].meetInfo) {
            //          array = [];
            //           for(let j =0;j<result[i].meetInfo.length;j++){
            //         if(result[i].meetInfo[j].results) {
            //             for(let r =0;r<result[i].meetInfo[j].results.length;r++) {
            //                 result[i].meetInfo[j].results[r]['event'] = result[i].meetInfo[j].event
            //                 result[i].meetInfo[j].results[r]['gender']=result[i].meetInfo[j].gender
            //                 array.push(result[i].meetInfo[j].results[r])
            //          }
            //         }
            //      }
            //      mainAarray.push({
            //         name:result[i].meetName,
            //         results:array,
            //         course:result[i].course,
            //         date:result[i].date,
            //         nameYear:result[i].nameYear,
            //         smName:result[i].smName,
            //     })
            //     }
            //      console.log(mainAarray.length)
            // }
            // for(let i = 0;i<mainAarray.length;i++) {
            //     let meetRes = new CompResults({results:mainAarray[i].results,meetName:mainAarray[i].name,course:mainAarray[i].course,date:mainAarray[i].date,nameYear:mainAarray[i].nameYear,smName:mainAarray[i].smName})
            //     console.log(meetRes)
            //     meetRes.save((error,item) => {
            //             console.log(item)
            //             console.log(error)
            //          })
            // }
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
        await CompResults.find().select({'results':1}).then((results) => {
            // foundMeet = results.find((item) => {
            //     return item.nameYear == req.body.meetName
            // })
            return results;
        }) .then((results) => {
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
