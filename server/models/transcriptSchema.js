let mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

var tagSchema = new mongoose.Schema({
  PERSON: Array,
  DATE: Array,
  ORG: Array,
  TIME: Array
});

var ownersSchema = new mongoose.Schema({
  coach: Array,
  client: Array
});

var transcriptSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  path: String,
  tags: [tagSchema],
  coach_keywords: Array,
  client_keywords: Array,
  owners: [ownersSchema]
});



module.exports = mongoose.model('Transcripts', transcriptSchema );