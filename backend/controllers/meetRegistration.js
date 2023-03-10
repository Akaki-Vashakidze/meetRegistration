
const Results = require('../models/results')
const RegistrationInfo = require('../models/registeredSwimmers')
const CompResults = require('../models/compResults')

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
        CompResults.find({}, { results: 1 })
            .then((item) => {
                let names = [];
                for(let i = 0;i<item.length;i++){
                   item[i].results.map(item => {
                    names.push(item.name)
                   })
                }
                return names;
            })
            .then(item => {
                let filteredNames = [...new Set(item)]
                res.send(filteredNames)
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
    let swimmerAllEvents = [];
    try {
        await CompResults.find()
        .then(item => {
            item.map(obj => {
                obj.results.map(info => {
                    if(info.name == req.body.lastname + ' ' + req.body.name && info.event == req.body.distance + ' ' + style && obj.course == poolSize) {
                        info['bestResultCompName'] = obj.meetName
                        info['bestResultCompDate'] = obj.date
                        swimmerAllEvents.push(info)
                    } 
                })
            })
            if(swimmerAllEvents.length > 0) {
                 return swimmerAllEvents
            } else {
                CompResults.findOne({"results.name":req.body.lastname + ' ' + req.body.name},(err,item)=>{
                    if(item) {
                         let obj = item.results.find(info => {
                              return info.name === req.body.lastname + ' ' + req.body.name
                          })
                          let option2 = {name:obj.name,age:obj.age,club:obj.club,gender:obj.gender,compInfo:req.body.compInfo}
                          // res.send({name:obj.name,age:obj.age,club:obj.club,gender:obj.gender})
                          res.send(option2)
                    }
                    else {
                        res.status(404).send(err)
                    }
                })
            
                    
              
            }
        })
        .then(item => {
            if(item) {
                      let swimmerBestTimeObj = item.reduce(function (prev, current) {
                     return (prev.resultForSort < current.resultForSort) ? prev : current
                 })
                 res.send({ ...swimmerBestTimeObj,compInfo:req.body.compInfo})
            }
      
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send("something went wrong")
    }
}