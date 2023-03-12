const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const clubsSchema = new Schema({
name:String
})

module.exports = mongoose.model('clubs',clubsSchema,'clubs')