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

  clausesGroupedByOwner = async function (query){
    try {
      const matchStage = {$match: query}
      const groupStage = {$group: {_id: "$owner", sentences: {$push: "$sentence"}}}
      var result;
      result = await this.Clauses.aggregate([matchStage, groupStage]).asArray();

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

  cbtMap = async function (transcriptId, ownerId){
    let query;
    let options;
    let sentenceDoc;
    let sentenceNode;
    let listOfSentenceNodes; 
    let sentenceId;
    let cbtNodesList;

    //Get the sentences with clauses tag as Taking Step
    query = {
      'transcript': new ObjectId(transcriptId), 
      'owner': new ObjectId(ownerId), 
      'subtype': "taking step"
    };
    options = {"projection": {sentence: 1, _id: 0}};
    const takingStepId = await this.findInDb(this.Clauses, query, options);

    if(takingStepId.length > 0) {
      for (sentenceId of takingStepId){
        sentenceDoc = await this.findInDb(this.Sentences, {_id: sentenceId});
        sentenceNode = await createSentenceNode(sentenceDoc);
        listOfSentenceNodes.push(sentenceNode);
      }
      cbtNodesList.push(listOfSentenceNodes)
      listOfSentenceNodes = [];
    }
    //Get the sentences with clauses tag as a Reason
    query = {
      'transcript': new ObjectId(transcriptId), 
      'owner': new ObjectId(ownerId), 
      'subtype': "reason"
    };
    options = {"projection": {sentence: 1, _id: 0}};
    const reasonId = await this.findInDb(this.Clauses, query, options);

    if(reasonId.length > 0) {
      for (sentenceId of reasonId){
        sentenceDoc = await this.findInDb(this.Sentences, {_id: sentenceId});
        sentenceNode = await createSentenceNode(sentenceDoc);
        listOfSentenceNodes.push(sentenceNode);
      }
      cbtNodesList.push(listOfSentenceNodes)
      listOfSentenceNodes = [];
    }
    //Get the sentences with clauses tag as a Desire
    query = {
      'transcript': new ObjectId(transcriptId), 
      'owner': new ObjectId(ownerId), 
      'subtype': "desire"
    };
    options = {"projection": {sentence: 1, _id: 0}};
    const desireId = await this.findInDb(this.Clauses, query, options);

    if(desireId.length > 0) {
      for (sentenceId of desireId){
        sentenceDoc = await this.findInDb(this.Sentences, {_id: sentenceId});
        sentenceNode = await createSentenceNode(sentenceDoc);
        listOfSentenceNodes.push(sentenceNode);
      }
      cbtNodesList.push(listOfSentenceNodes)
      listOfSentenceNodes = [];
    }

    console.log(`cbtNodesList:`,cbtNodesList)
    if (cbtNodesList){
      return cbtNodesList;
    }else{
      return null;
    }

  }

  miMap = async function (transcriptId, ownerId, precision){
    let numberOfTurns = await this.Sentences.findOne({transcript:ObjectId(transcriptId), owner:ownerId},{"projection":{turn:1, _id:0}, "sort":{turn:-1}});
    numberOfTurns = numberOfTurns['turn']
    const turnsPerCard = Math.floor(numberOfTurns/precision);
    let match;
    let group;
    let sort;
    let initSearch=1;
    let sequenceResult;
    let listOfSubtypes = [];
    let clauseNode;
    let listOfClauses;
    let clauseDoc;
    let result;
    let clauseId;
    let endSearch;
    let dominantSubtype;
    for (let i = 0; i < precision; i++){
      listOfClauses = []
      endSearch = initSearch+turnsPerCard;
      match = {
        '$match': {
            'owner': ownerId, 
            'transcript': ObjectId(transcriptId), 
            '$and': [{
                    'turn': {'$gt': initSearch}}, {
                    'turn': {'$lt': endSearch}}], 
            'subtype': {$nin: ['Nothing']}}}
      group = {$group: {_id: '$subtype', count: {'$sum': 1},clauses: {'$push': '$_id'}}}
      sort = {$sort: {count: -1}}
      let query = [match, group, sort]
      result = await this.Clauses.aggregate(query).asArray();

      if(result.length > 0) {
        dominantSubtype = result[1]['_id'];
        console.log(`Successfully found document: `,dominantSubtype)

        for (clauseId of result[1]['clauses']){
          clauseDoc = await this.findInDb(this.Clauses, {_id: clauseId})
          clauseNode = await createClauseNode(clauseDoc[0]);
          console.log(`A node: `,clauseNode)
          listOfClauses.push(clauseNode);
        }

        sequenceResult = {"subtype":dominantSubtype, "nodes":listOfClauses}
        listOfSubtypes.push(sequenceResult)
        initSearch = initSearch+turnsPerCard;
      } else {
        console.log("No document matches the provided query: ", query)
      }
    }
    console.log(`listOfSubtypes:`,listOfSubtypes)
    if (listOfSubtypes){
      return listOfSubtypes;
    }else{
      return null;
    }
  };

  updateClause = function (clauseId, updatedField){
    const query = { "_id": ObjectId(clauseId) };
    const update = updatedField;

    this.Clauses.updateOne(query, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully added a new review: ${update}`)
        }
      })
      .catch(err => console.error(`Failed to add review: ${err}`))
  }

  updateClauseOwnerId = function (newValue){
    const query = {};
    const update = {owner_id: newValue};

    this.Clauses.updateOne(query, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully added a new review: ${update}`)
        }
      })
      .catch(err => console.error(`Failed to add review: ${err}`))
  }

  updateSentenceOwnerId = function (newValue){
    const query = {};
    const update = {owner_id: newValue};

    this.Sentences.updateOne(query, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully added a new review: ${update}`)
        }
      })
      .catch(err => console.error(`Failed to add review: ${err}`))
  }

  updateTranscriptOwnerId = function (newValue){
    const query = {};
    const update = {owner_id: newValue};

    this.Transcripts.updateOne(query, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully added a new review: ${update}`)
        }
      })
      .catch(err => console.error(`Failed to add review: ${err}`))
  }

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

  getTranscriptKeywords = async function (transcriptId){
    //Query the coach keywords
    var query = {'_id': ObjectId(transcriptId)};
    var project = 'coach_keywords';
    var options = {"projection": {coach_keywords:1, _id: 0}};
    var docs = await this.findInDb(this.Transcripts, query, options )
    const coach = await this.docToArray(docs, project);
    //Query the client keywords
    query = {'_id': ObjectId(transcriptId)};
    project = 'client_keywords'
    options = {"projection": {client_keywords:1, _id: 0}};
    docs = await this.findInDb(this.Transcripts, query, options )
    const client = await this.docToArray(docs, project);
    return {coachKeywords: coach[0], clientKeywords: client[0]};
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
    let match = {};
    let project = "";
    match.transcript = ObjectId(transcriptId);
    //match.owner = ObjectId(ownerId);
    //Make sure we don't get the useless statements
    match.subtype = {$ne: ["Nothing"]}

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
  
    // ------------ Identify hashtags -------------
  
    for (var hashtag of hashtags) {
      if (hashtag === hashtag.toUpperCase()){
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
          if (hashtag === 'desire' || hashtag === 'need' || hashtag === 'ability' || hashtag === 'reason' || hashtag === 'commitment' || hashtag === 'activation' || hashtag === 'step' || hashtag === 'Nothing'){
            // return sentences with the mentionned tense
            if(hashtag==='step'){hashtag="taking step"}
            match.subtype = hashtag;
            continue;
          }
          if (hashtag === 'Open' || hashtag === 'Closed' || hashtag === 'Affirmation'){
            // return sentences with the mentionned tense
            if(hashtag==='Open' || hashtag === 'Closed'){hashtag = hashtag+" Question"}
            match.type = hashtag;
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
    let listOfClauses = [];
    let clauseNode = [];
    let sentenceNode = [];
    let sentenceObject = {};
    let sentenceClauses = [];
    var sentence = {};
    var clausesByOwner;
    let ownerListOfSentences;
    var sentencesByOwners = []
    // Look for all the clauses that satisfy the query parameters
    console.log("Look for clauses matching: ", match)
    clausesByOwner = await this.clausesGroupedByOwner(match)

    // Check if query returned anything
    if (typeof clausesByOwner !== 'undefined' && clausesByOwner.length > 0){
      
      for (let owner of clausesByOwner){
        ownerListOfSentences= [];
        clausesResult = owner.sentences
        var sentenceId;
        for (let clause of clausesResult) {
          listOfClauses = [];
          sentenceId = clause;
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
          ownerListOfSentences.push(sentenceObject);
        }
        sentencesByOwners.push(ownerListOfSentences)
        console.log('Output sentencesByOwners: ', sentencesByOwners)
      }
      // For each of the found clauses...
      
    }
     return sentencesByOwners
  };

}

export default MongoStitch;