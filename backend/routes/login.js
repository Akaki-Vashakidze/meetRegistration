const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require("bcrypt")


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
                                number:user.number
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




module.exports = router;