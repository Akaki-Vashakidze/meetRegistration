const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../models/user')
const ActCode = require('../models/actCodes')
const Results = require('../models/results')
const mongoose = require('mongoose');
const db = 'mongodb+srv://akak1:jvh7nROHs5RgjrCH@cluster0.fcpniir.mongodb.net/results?retryWrites=true&w=majority';
const bcrypt = require("bcrypt")
const saltRounds = 10


mongoose.connect(db, err => {
    if (err) {
        console.log(err)
    } else {
        console.log('connected to mongodb')
    }
})

router.get('/', (req, res) => {
    res.send('From Api route')
})

router.post('/actcodes', async (req, res) => {
    try {
        // let actCode = await ActCode.create({code:req.body})
        let actCode = new ActCode({ ...req.body, used: false })
        actCode.save((error, addedActcode) => {
            res.status(200).send(addedActcode)
        })
    }
    catch {
        res.status(500).send("something went wrong1 111")
    }
})

router.post('/meetResults',async(req,res)=> {
    try {
        let foundMeet;
         await Results.find().then((results) => {
            foundMeet =  results.find((item)=>{
                return item.nameYear == req.body.meetName
            })
        })
        res.send(foundMeet)
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})

router.post('/eventResults',async(req,res)=> {
    try {
        let foundMeet;
        let foundEvent;
         await Results.find().then((results) => {
            foundMeet =  results.find((item)=>{
                return item.nameYear == req.body.meetName
            })
        })
        
        foundEvent = await foundMeet.meetInfo.find((item)=>{
         return item.event == req.body.eventName && item.gender == req.body.gender
        })
        res.send(foundEvent)
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})

router.post('/swimmerCardInfo', async(req,res) => {
    let style = req.body.style;
    style == 'ბატერფლაი' ? style = 'ბატ.': style=style;
    style == 'თავისუფალი ყაიდა' ? style = 'თ/ყ': style=style;
    style == 'გულაღმა ცურვა' ? style = 'გ/ც': style=style;
    let event = req.body.distance + ' ' + style;
    let swimmerFullName = req.body.lastname + ' ' + req.body.name;
    let poolSize = req.body.poolSize
    let meetInformation;
    try {
      await Results.find()
      .then(item => {
       let array = []
       for(let i=0;i<item.length;i++) {
        if(item[i].course == poolSize) {
            for (let j=0;j<item[i].meetInfo.length;j++) {
            array.push(item[i].meetInfo[j]) 
        }
        }
       }
       return array
      })
      .then(item => {
        let filteredEvents
       for(let i = 0;i<item.length;i++) {
        filteredEvents = item.filter(info => {
            return info.event == event
        })
       }
       return filteredEvents;
      })
      .then(item => {
       let eventsAllResults = [];
       for(let i = 0; i < item.length; i++) {
        for(let j = 0;j < item[i].results.length;j++) {
             eventsAllResults.push(item[i].results[j])
        }
        }
        return eventsAllResults
     })
     .then(item => {
        let searchedSwimmerAllEvents;
        searchedSwimmerAllEvents = item.filter(info=>{
           return info.name == swimmerFullName;
        })
        return searchedSwimmerAllEvents;
     })
     .then(item => {
        // პუოლობს ყველაზე კარგ შედეგს;
       let swimmerBestTime = item.reduce(function(prev, current) {
        return (prev.resultForSort < current.resultForSort) ? prev : current
    })
       return swimmerBestTime;
     })
     .then(async item => {
        // აქ იღებ ინფორმაციას მცურავეზე - კაცია თუ ქალი;
       let hh = await Results.find({"meetInfo.results":{$elemMatch:{name:swimmerFullName}}})
       for(let i = 0;i<hh.length;i++) {
        for(let j = 0; j<hh[i].meetInfo.length;j++) {
            for(let k = 0;k<hh[i].meetInfo[j].results.length;k++) {
               if(hh[i].meetInfo[j].results[k].name == swimmerFullName) {
                   return {...item,gender:hh[i].meetInfo[j].gender}
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






router.post('/register', async (req, res) => {
    try {
        let userData = req.body
        // პაროლის დაშიფრვა
        bcrypt
            .genSalt(saltRounds)
            .then(salt => {
                return bcrypt.hash(userData.password, salt)
            })
            .then(hash => {
                userData.password = hash;
            })
            .catch(err => console.error(err.message))
        //აქტივაციის კოდის შემოწმება
        const code = await ActCode.findOne({ actCode: userData.actCode });
        // აქტივაციის კოდის შემოწმება (გამოყენებულია თუ არა)
        if (code) {
            if (code.used) {
                res.status(401).send('კოდი უკვე გამოყენებულია')
            } else {
                // მეილის შემოწმება (უკვე ხომ არ არსებობს)
                const user = await User.findOne({ email: userData.email })
                if (user) {
                    res.status(401).send('User Email is Taken')
                } else {
                    // გამოყენებული აქტივაციის კოდის მონიშვნა 
                    await ActCode.findOneAndUpdate({ actCode: userData.actCode }, { used: true , user:{name:userData.name,lastname:userData.lastname,email:userData.email}})
                    //ახალი მომხმარებლის შენახვა
                    let user = new User(userData)
                    user.save((error, registeredUser) => {
                        let payload = { subject: registeredUser._id }
                        let token = jwt.sign(payload, 'secretKey')
                        res.status(200).send({
                            token: token,
                            user: {
                                email: registeredUser.email,
                                name: registeredUser.name,
                                lastname: registeredUser.lastname,
                            }
                        })
                    })
                }
            } 
        }else {
                res.status(401).send('acCode ი არასწორია')
            }

    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})


router.post('/login', async (req, res) => {
    try {
        let userData = req.body;
        User.findOne({ email: userData.email }, (error, user) => {
            if (error) {
                console.log(error)
            } else {
                if (!user) {
                    res.status(401).send('invalid email')
                } else {
                    if (!compareHush(userData.password, user.password)) {
                        res.status(401).send('invalid password')
                    } else {
                        let payload = { subject: user._id }
                        let token = jwt.sign(payload, 'secretKey')
                        res.status(200).send({
                            token,
                            user: {
                                email: user.email,
                                name: user.name,
                                lastname: user.lastname,
                            }
                        })
                    }
                }
            }
        })
    }
    catch (error) {
        res.status(500).send("something went wrong")
    }

})


function compareHush(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}


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

router.get('/names', verifyToken, async (req, res) => {
    try {
        Results.find({},{meetInfo:1}).then((result) => {
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