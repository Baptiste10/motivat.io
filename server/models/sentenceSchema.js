let mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

var sentimentSchema = new mongoose.Schema({
    mood: String,
    confidence: Number
})

var sentenceSchema = new mongoose.Schema({
  _id: ObjectId,
  turn: Number,
  transcript: ObjectId,
  title: String,
  owner: ObjectId,
  text: String,
  overall_mood: [sentimentSchema]
});

module.exports = mongoose.model('Sentences', sentenceSchema );