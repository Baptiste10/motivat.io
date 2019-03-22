const ObjectId = require('mongodb').ObjectID
const {
        Stitch,
        RemoteMongoClient,
        AnonymousCredential
      } = require('mongodb-stitch-browser-sdk');

const NodeMaker = require('./NodeMaker');
const createSentenceNode = NodeMaker.createSentenceNode;
const createClauseNode = NodeMaker.createClauseNode;

class MongoStitch {
  constructor(){
    this._init();
  };

  _init = async function(){
    this.stitchApp = await Stitch.initializeDefaultAppClient("motivatiio-zkwky");
    this.mongodb = await this.stitchApp.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
    this.db = this.mongodb.db('mydatabase');
    this.user = await this.stitchApp.auth.loginWithCredential(new AnonymousCredential());
    console.log(`Logged in as anonymous user with id: ${this.user.id}`);

    this.Transcripts = await this.db.collection("Transcripts");
    this.Sentences = await this.db.collection("Sentences");
    this.Clauses = await this.db.collection("Clauses");
  };
  
  findInDb = async function (collectionName, query, options){
    try {
      var result;
      if (options){
        result = await collectionName.find(query, options).asArray();
      }
      else {
        result = await collectionName.find(query).asArray();
      }
      if(result.length > 0) {
        console.log(`Successfully found document: `,result)
      } else {
        console.log("No document matches the provided query: ", query)
      }
      return result;
      }catch(e) {
        console.log(e);
      }
  };

  getAllTranscripts = async function () {
    const query = {};
    const project = "name";
    const options = {"projection": {name: 1}};
    const docs = await this.findInDb(this.Transcripts, query, options );
    const transcriptsName = await this.docToArray(docs, project);
    return transcriptsName
  };

  getTranscriptId = async function (transcriptName){
    const query = {'name': transcriptName};
    const project = "_id";
    const options = {"projection": {_id: 1}};
    const docs = await this.findInDb(this.Transcripts, query, options );
    const transcriptId = await this.docToArray(docs, project);
    try{
      console.log('TR ID FOUND: ', transcriptId[0].toString())
      return transcriptId[0].toString()
    }catch(e){
      console.log('No transcript selected');
      return null;
    }
  };

  getTranscriptOwners = async function (transcriptId){
    //Query the coach data
    var query = {'_id': ObjectId(transcriptId)};
    var project = 'coach';
    var options = {"projection": {coach:1, _id: 0}};
    var docs = await this.findInDb(this.Transcripts, query, options )
    const coach = await this.docToArray(docs, project);
    //Query the client data
    query = {'_id': ObjectId(transcriptId)};
    project = 'client'
    options = {"projection": {client:1, _id: 0}};
    docs = await this.findInDb(this.Transcripts, query, options )
    const client = await this.docToArray(docs, project);
    return [client[0], coach[0]];
  };

  docToArray = function (docs, project) {
    var results = [];
      for (var element of docs) {
        results.push(element[project]);
      }
    console.log(results)
    return results;
  };


  searchHandler = async function (searchParameters, transcriptId, ownerId) {
    console.log('Search parameters: ',searchParameters, transcriptId, ownerId);
    // -----------Declare search parameters ------------
    let text = searchParameters;
    let keywords = '';
    let match = {};
    let project = "";
    match.transcript = ObjectId(transcriptId);
    match.owner = ObjectId(ownerId);

    // ------------- Extract hashtags -------------
    
    // Save hashtags in a list
    let hashtags = []
    var myRegexp = /#([\w-]+)/gi;
    let aMatch = myRegexp.exec(text);
    while (aMatch != null) {
      hashtags.push(aMatch[1])
      aMatch = myRegexp.exec(text);
    }
    // Remove hashtags from string
    text = text.replace(/#([\w-]+)/gi,"");
  
    // Assume remaining text are normal keywords. TEXT SEARCH UNSUPPORTED BY STITCH SO FAR
    //keywords = text.replace(/\s\s+/g, ' ');
    //match.$text = {$search: keywords};
  
    // ------------ Identify hashtags -------------
  
    for (var hashtag of hashtags) {
      if (hashtag == hashtag.toUpperCase()){
        // return sentences involving his named entity category
        match.tags = hashtag;
      }else {
          if (hashtag === 'pos' || hashtag === 'neg') {
            // return sentences with the mentionned sentiment
            match.sentiment = hashtag;
            continue;
          }
          if (hashtag === 'pres' || hashtag === 'past'){
            // return sentences with the mentionned tense
            match.tense = hashtag;
            continue;
          }
      }
    }
  
    // ----------- Query Database -------------
    
    const sentenceTupleList = await this.searchQueries(match, project);
    return sentenceTupleList;
  };

  // Query db for sentences matching the match parameter
  searchQueries = async function (match, project) {
    let clausesResult = [];
    let listOfSentences= [];
    let listOfClauses = [];
    let clauseNode = [];
    let sentenceNode = [];
    let sentenceObject = {};
    let sentenceClauses = [];
    var sentence = {};
    // Look for all the clauses that satisfy the query parameters
    console.log("Look for clauses matching: ", match)
    clausesResult = await this.findInDb(this.Clauses, match, project)

    // Check if query returned anything
    if (typeof clausesResult !== 'undefined' && clausesResult.length > 0){

      // For each of the found clauses...
      var sentenceId;
      for (let clause of clausesResult) {
        listOfClauses = [];
        sentenceId = clause['sentence'];
        // ...find all the clauses belonging to the same sentence
        sentenceClauses = await this.findInDb(this.Clauses, {sentence: sentenceId})

        // For each one of these "sibling clauses" make a node
        for (let innerClause of sentenceClauses){
          clauseNode = await createClauseNode(innerClause);
          listOfClauses.push(clauseNode);
        }
        
        // ...find this clause original sentence and make a node out of it
        sentence = await this.findInDb(this.Sentences, {_id: sentenceId});
        sentenceNode = await createSentenceNode(sentence[0]);
        sentenceObject = {sentence:sentenceNode, clauses:listOfClauses};
        listOfSentences.push(sentenceObject);
      }
    }
    console.log('Output listOfSentences: ', listOfSentences)
     return listOfSentences
  };

}

function unique(arr) {
  var hash = {}, result = [];
  for ( var i = 0, l = arr.length; i < l; ++i ) {
      if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
          hash[ arr[i] ] = true;
          result.push(arr[i]);
      }
  }
  return result;
}


export default MongoStitch;