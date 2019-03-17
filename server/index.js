// Server
const express = require('express')

let mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

const SERVER = '127.0.0.1:27017'; // DB SERVER
const DATABASE = 'mydatabase';    // DB NAME

class TranscriptHandler {
  constructor() {
    this._connectMongo();
    this._connectServer();
    this.getInitialIds();
  }

  _connectMongo() {
    //Set up mongoose connection
    mongoose.connect(`mongodb://${SERVER}/${DATABASE}`, { useNewUrlParser: true })
    // mongoose.Promise = global.Promise;
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    // Collection Schemas and models
    const Schema = mongoose.Schema;
    this.Transcripts = mongoose.model("Transcripts", new Schema({}), "Transcripts");
    this.Sentences = mongoose.model("Sentences", new Schema({}), "Sentences");
    this.Clauses = mongoose.model("Clauses", new Schema({}), "Clauses");
  }

  _connectServer() {
    this.db.once('open', () => {
        const app = express();

        app.get('/', (req, res) => {
          this.execQuery(this.Transcripts, {}, 'name')
          .then(data => res.send(data))
          .catch();
        });
        
        // Potential useful methods to use:
        // res.download()	Prompt a file to be downloaded: to get the ArgDown
        // res.json()	Send a JSON response: for the sentences from the db
        
        
        app.listen(3000, () => {
            console.log('Listening on port 3000.')
        })
    })
  }

  // Init active transcript
  async getInitialIds() {
    let transcriptNames = await this.execQuery(this.Transcripts, {}, 'name');
    //Let the user pick a transcript name
    this.transcriptId = await this.execQuery(this.Transcripts, {name: transcriptNames[0]}, '_id');
    let owners = await this.execQuery(this.Transcripts, {_id: this.transcriptId}, 'owners');
    //The open owner tab is the init active user, the client by default
    this.activeOwnerId = owners[0].client[0];
    this.activeTalkType = '_talk_type_client_'
    this.activeSubType = '_sub_type_client_'
  }


  // Execute a query
  async execQuery(collectionName, match, project) {
    let query = this.myQuery(collectionName, match, project)
    let q = await query.exec();
    if (q){
      return this.docToList(q, project);
    } else {
      return null;
    }
  };

  // Convert Objects returned by Mongo into a list of the desired items
  docToList(docs, project) {
    var results = [];
    for (var element of docs) {
      results.push(element[project]);
    }
    return results;
  };

  // Build Query
  myQuery(collectionName, match, project) {
    let query = collectionName.find(match).lean();
    query.select(project);
    return query;
  };

  // Take an object containing the search parameters
  // Return an array of nodes
  searchHandler(searchParameters) {

    // -----------Declare search parameters ------------
  
    let text = searchParameters['keywords'];
    let namedEntity = "";
    let keywords = ""
    let match = {};
    match.transcript = this.transcriptId;
    match.owner = this.activeOwnerId;
    
    if (searchParameters[this.activeTalkType] != 'all') {
      match.type = searchParameters[this.activeTalkType]
    };
    if (searchParameters[this.activeSubType] != 'all') {
      match.subtype = searchParameters[this.activeSubType]
    };
  
    // ------------- Extract hashtags -------------
    
    // Save hashtags in a list
    let hashtags = []
    var myRegexp = /#([\w-]+)/gi;
    match = myRegexp.exec(text);
    while (match != null) {
      hashtags.push(match[1])
      match = myRegexp.exec(text);
    }
    // Remove hashtags from string
    text = console.log(text.replace(/#([\w-]+)/gi,""));
  
    // Assume remaining text are normal keywords
    keywords = text.replace(/\s\s+/g, ' ');
  
    // ------------ Identify hashtags -------------
  
    for (var hashtag of hashtags) {
      if (hashtag == hashtag.toUpperCase()){
        console.log("UP")
        // return sentences involving his named entity category
        match.tags = hashtag;
      }else {
          console.log("LO")
          if (hashtag === 'pos' || hashtag === 'neg') {
            // return sentences with the mentionned sentiment
            match['sentiment.mood'] = hashtag;
            continue;
          }
          if (hashtag === 'pres' || hashtag === 'past'){
            // return sentences with the mentionned tense
            match.tense = hashtag;
            continue;
          }
      }
    }
  
    project = "sentence";
  
    // ----------- Query Database -------------
    
    const sentenceTupleList = this.searchQueries(match, project);
  };

  // Query db for sentences matching the match parameter
  async searchQueries(match, project) {
    let clausesResult = [];
    let sentenceTuplesList= [];
    var sentence = {};
  
    clausesResult = await this.execQuery(this.Clauses, match, project);
    for (clause of clausesResult) {
      sentence = await this.execQuery(this.Sentences, {_id: clause[0]});
      //sentenceTuplesList.push(this.createSentencetuple(sentence))
    }
    // return sentenceTuplesList
  }
  
  // Create the sentence node/tuple out of a db document
  createSentencetuple(sentence, typology="", group="") {
    let node = {
      id: sentence['_id'],
      name: sentence['title'],
      text: sentence['text'],
      typology: typology,
      mood: sentence["sentiment"]["mood"],
      group: group,
      title: function() {
        if(this.typology==='statement'){
          let opening = "[";
          let closing = "]";
        }
        if(this.typology==='argument'){
          let opening = "<";
          let closing = ">";
        }
        return opening+this.name+closing;
      },
      body: function(){
        let colon = ": ";
        return colon+this.text;
      },
      completeNode: function(){
        return this.title()+this.body()
      },
      relation: function(){
        if(this.sentiment === 'pos'){
          return "+ ";
        }
        if(this.sentiment === 'neg'){
          return "- ";
        }
      }
    }
    return node;
  }
  
}

d = new TranscriptHandler()

// Find all the transcript names
// execQuery(d.Transcripts, {}, 'name');

// FInd the the transcript id from its transcript name
// execQuery(Transcripts, {name: 'DT'}, '_id');

  