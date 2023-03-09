const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const allMeetsSchema = new Schema({
_id:String,
course:String,
date:String,
meetName:String,
nameYear:String,
smName:String,
})

module.exports = mongoose.model('allMeets',allMeetsSchema,'allMeets')