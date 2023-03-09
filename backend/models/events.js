const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const allEventsSchema = new Schema({
_id:String,
event:String,
gender:String,
name:String,
result:String,
resultForSort:String,
points:String,
age:String,
country:String,
club:String,
_idComp:String
})

module.exports = mongoose.model('allEvents',allEventsSchema,'allEvents')