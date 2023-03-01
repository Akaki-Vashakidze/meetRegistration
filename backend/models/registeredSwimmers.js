const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const registeredSwimmersSchema = new Schema({
user:String,
cards:Object
})

module.exports = mongoose.model('registeredSwimmers',registeredSwimmersSchema,'registeredSwimmers')