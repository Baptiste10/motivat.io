let mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

let transcriptSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  path: String,
  tags: {
    PERSON: String,
    DATE: String,
    ORDINAL: String,
    GPE: String,
    ORG: String,
    CARDINAL: String,
    WORK_OF_ART: String,
    TIME: String,
    NORP: String,
  },
  coach_keywords: Array,
  client_keywords: Array,
  owners: {
    coach: Array,
    client: Array
  }
})


module.exports = mongoose.model('Transcripts', transcriptSchema );