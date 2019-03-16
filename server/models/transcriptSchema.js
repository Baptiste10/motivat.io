let mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var tagSchema = new mongoose.Schema({
  PERSON: [],
  DATE: [],
  ORG: [],
  TIME: []
});

var ownersSchema = new mongoose.Schema({
  coach: [],
  client: []
});

var transcriptSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  path: String,
  tags: [tagSchema],
  coach_keywords: [],
  client_keywords: [],
  owners: [ownersSchema]
});



module.exports = mongoose.model('Transcripts', transcriptSchema );