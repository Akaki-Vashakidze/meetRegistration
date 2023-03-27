const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = process.env.PORT || 3500;
const meetRegistration = require('./routes/meetRegistration')
const registration = require('./routes/registration')
const login = require('./routes/login')
const results = require('./routes/results')
const app = express()
const compression = require('compression')

const mongoose = require('mongoose');
const db = 'mongodb+srv://akak1:Akaki111111@cluster0.fcpniir.mongodb.net/results?retryWrites=true&w=majority';

app.use(cors())
app.use(compression())
app.use(bodyParser.json())

mongoose.connect(db, err => {
    if (err) {
        console.log(err)
    } else {
        console.log('connected to mongodb')
    }
})


app.use('/meetRegistration',meetRegistration)
app.use('/registration',registration)
app.use('/login',login)
app.use('/results',results)

app.get('/', function(req,res){
    
})

app.listen(PORT,function(){
    console.log('server running ' + PORT)
})

