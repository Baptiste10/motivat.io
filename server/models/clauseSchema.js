let mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

var sentimentSchema = new mongoose.Schema({
    mood: String,
    confidence: Number
})

var clauseSchema = new mongoose.Schema({
    _id: ObjectId,
    transcript: ObjectId,
    turn: Number,
    sentence: ObjectId,
    owner: ObjectId,
    text: String,
    type: String,
    subtype: String,
    subject: String,
    tense: String,
    sentiment: [sentimentSchema],
    tags: Array
})

module.exports = mongoose.model('Clauses', clauseSchema );