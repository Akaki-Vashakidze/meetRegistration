
const Results = require('../models/results')
const RegistrationInfo = require('../models/registeredSwimmers')

exports.registerSwimmers = async (req,res) => {
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
}

exports.getNames =  async (req, res) => {
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
}

exports.getSwimmerCardInfo = async (req, res) => {
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
}