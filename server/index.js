// Server
const express = require('express')

let mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

const SERVER = '127.0.0.1:27017'; // DB SERVER
const DATABASE = 'mydatabase';    // DB NAME

//Set up mongoose connection
mongoose.connect(`mongodb://${SERVER}/${DATABASE}`, { useNewUrlParser: true })
// mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Collection Schemas and models
Schema = mongoose.Schema;
var Transcripts = mongoose.model("Transcripts", new Schema({}), "Transcripts");
var Sentences = mongoose.model("Sentences", new Schema({}), "Sentences");
var Clauses = mongoose.model("Clauses", new Schema({}), "Clauses");

db.once('open', () => {
    const app = express();

    app.get('/home', (req, res) => {
        Transcripts.find({}, function(err, docs) {
          console.log(project);
          res.send(project);
        })
    });
    
    // Potential useful methods to use:
    // res.download()	Prompt a file to be downloaded: to get the ArgDown
    // res.json()	Send a JSON response: for the sentences from the db
    
    
    app.listen(3000, () => {
        console.log('Listening on port 3000.')
    })
})

// Find all the transcript names
// execQuery(Transcripts, {}, 'name');

// FInd the the transcript id from its transcript name
// execQuery(Transcripts, {name: 'DT'}, '_id');



// Convert Objects returned by Mongo into a list of the desired items
function docToList(docs, project) {
  var results = [];
  for (element of docs) {
    results.push(element[project]);
  }
  console.log(results)
}

// Execute a query
function execQuery(collectionName, match, project) {
  let query = myQuery(collectionName, match, project)
  query.exec()
  .then(results => {
    docToList(results, project)
  })
  .catch(err => {
    console.error(err);
  })
}

// Build Query
function myQuery(collectionName, match, project) {
  let query = collectionName.find(match).lean();
  query.select(project);
  return query;
};