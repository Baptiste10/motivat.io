let mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var sentimentSchema = new mongoose.Schema({
    mood: String,
    confidence: Number
})

var sentenceSchema = new mongoose.Schema({
  _id: {},
  turn: {},
  transcript: {},
  title: {},
  owner: {},
  text: String,
  overall_mood: Map
});

module.exports = mongoose.model('Sentences', sentenceSchema );