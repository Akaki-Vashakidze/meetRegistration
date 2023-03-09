const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const compResultsSchema = new Schema({
results:Array,
meetName:String,
course:String,
date:String,
nameYear:String,
smName:String,
})

module.exports = mongoose.model('compResults',compResultsSchema,'compResults')