let mongoose = require('mongoose')

var kittySchema = new mongoose.Schema({
  name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);

module.exports = mongoose.model('Kitten', kittySchema );