const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const registeredSwimmersSchema = new Schema({
user:String,
cards:Object,
compID:String,
compInfo:Object
})

module.exports = mongoose.model('registeredSwimmers',registeredSwimmersSchema,'registeredSwimmers')