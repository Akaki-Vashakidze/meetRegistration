const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../models/user')
const ActCode = require('../models/actCodes')
const bcrypt = require("bcrypt")
const saltRounds = 10

router.post('/actcodes', async (req, res) => {
    try {
        // let actCode = await ActCode.create({code:req.body})
        let actCode = new ActCode({ ...req.body, used: false })
        actCode.save((error, addedActcode) => {
            res.status(200).send(addedActcode)
        })
    }
    catch (error) {
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
                    await ActCode.findOneAndUpdate({ actCode: userData.actCode }, { used: true, user: { name: userData.name, lastname: userData.lastname, email: userData.email } })
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
                                number:registeredUser.number
                            }
                        })
                    })
                }
            }
        } else {
            res.status(401).send('acCode ი არასწორია')
        }

    }
    catch (error) {
        res.status(500).send("something went wrong")
    }
})

module.exports = router;