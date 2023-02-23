const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const actCodeSchema = new Schema({
actCode:String,
used:Boolean,
user:Object
})

module.exports = mongoose.model('actCodes',actCodeSchema,'actCodes')