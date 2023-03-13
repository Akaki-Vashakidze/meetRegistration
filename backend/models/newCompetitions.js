const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const newCompetitionSchema = new Schema({
    name: String,
    poolSize: String,
    startDate: String,
    endDate: String,
    deadline: String
})

module.exports = mongoose.model('newCompetitions',newCompetitionSchema,'newCompetitions')