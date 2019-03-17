// Server
const express = require('express')
const Database = require('./Database')
var ObjectId = require('mongoose').Types.ObjectId; 

class TranscriptHandler {
  constructor() {
    this.mongo = new Database();
    this._connectServer();
    this.getInitialIds();
  }
  _connectServer() {
    this.mongo.db.once('open', () => {
        const app = express();

        app.get('/', (req, res) => {
          this.mongo.execQuery(this.mongo.Transcripts, {}, 'name')
          .then(data => res.send(data))
          .catch();
        });

        app.get('/search/:searchParameters', (req, res) => {
          this.searchHandler(req.params.searchParameters)
          .then(data => {
            // console.log(data)
            let newData = data.length > 10 ? data.slice(0, 10) : data;
            console.log(newData);
            res.json(JSON.stringify(newData))  
          })
          .catch();
        });
        
        // Potential useful methods to use:
        // res.download()	Prompt a file to be downloaded: to get the ArgDown
        // res.json()	Send a JSON response: for the sentences from the db
        
        
        app.listen(3001, () => {
            console.log('Listening on port 3001.')
        })
    })
  }

  // Init active transcript
  async getInitialIds() {
    let transcriptNames = await this.mongo.execQuery(this.mongo.Transcripts, {}, 'name');
    //Let the user pick a transcript name
    this.transcriptId = await this.mongo.execQuery(this.mongo.Transcripts, {name: transcriptNames[0]}, '_id');
    this.transcriptId = ObjectId(this.transcriptId[0]);
    let owners = await this.mongo.execQuery(this.mongo.Transcripts, {_id: this.transcriptId}, 'owners');
    //The open owner tab is the init active user, the client by default
    this.activeOwnerId = ObjectId(owners[0].client[0]);
    this.activeTalkType = '_talk_type_client_'
    this.activeSubType = '_sub_type_client_'
    console.log(this.transcriptId, this.activeOwnerId)
  }

  // Take an object containing the search parameters
  // Return an array of nodes
  async searchHandler(searchParameters) {
    // -----------Declare search parameters ------------
    let text = searchParameters.split('_').join(' ');
    let namedEntity = "";
    let keywords = ""
    let match = {};
    let project = "";
    match.transcript = "5c8ce77e81a7c3221c80f862";
    match.owner = "5c8ce77e81a7c3221c80f861";

    /*
    if (searchParameters[this.activeTalkType] != 'all') {
      match.type = searchParameters[this.activeTalkType]
    };
    if (searchParameters[this.activeSubType] != 'all') {
      match.subtype = searchParameters[this.activeSubType]
    };
    */

    // ------------- Extract hashtags -------------
    
    // Save hashtags in a list
    let hashtags = []
    var myRegexp = /#([\w-]+)/gi;
    aMatch = myRegexp.exec(text);
    while (aMatch != null) {
      hashtags.push(aMatch[1])
      aMatch = myRegexp.exec(text);
    }
    // Remove hashtags from string
    text = text.replace(/#([\w-]+)/gi,"");
  
    // Assume remaining text are normal keywords
    keywords = text.replace(/\s\s+/g, ' ');
    match.$text = {$search: keywords};

    console.log(hashtags, keywords, match)
  
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
            match.sentimentMood = hashtag;
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
    console.log(match)
  
    // ----------- Query Database -------------
    
    const sentenceTupleList = await this.mongo.searchQueries(match, project);
    return sentenceTupleList;
  };

  // Query db for sentences matching the match parameter
  async searchQueries(match, project) {
    let clausesResult = [];
    let sentenceTuplesList= [];
    var sentence = {};
  
    clausesResult = await this.mongo.execQuery(this.mongo.Clauses, match, project)
    for (let clause of clausesResult) {
      sentence = await this.mongo.execQuery(this.mongo.Sentences, {_id: clause[0]});
      sentenceTuplesList.push(this.createSentenceJSON(sentence))
    }
     return sentenceTuplesList
  }
  
  // Create the JSON sentence out of its db document
  createSentenceJSON(sentence, typology="", group="") {
    let node = {
      id: sentence['_id'],
      name: sentence['title'],
      text: sentence['text'],
      typology: typology,
      mood: sentence["sentiment"] ? sentence["sentiment"]["mood"] : "",
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
    return JSON.stringify(node);
  }
  
}

d = new TranscriptHandler()

// Find all the transcript names
// execQuery(d.Transcripts, {}, 'name');

// FInd the the transcript id from its transcript name
// execQuery(Transcripts, {name: 'DT'}, '_id');

  