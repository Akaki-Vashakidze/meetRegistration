const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:String,
    lastname:String,
    email:String,
    number:String,
    gender:String,
    password:String,
    info:Object,
    actCode:String
})

module.exports = mongoose.model('user',userSchema,'users')