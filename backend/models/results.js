const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const resultSchema = new Schema({
_id:String,
course:String,
date:String,
meetInfo:Array,
meetName:String,
nameYear:String,
smName:String,
})

module.exports = mongoose.model('results',resultSchema,'results')