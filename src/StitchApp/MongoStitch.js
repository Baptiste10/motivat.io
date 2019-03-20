const BSON = require('bson');
const {
        Stitch,
        RemoteMongoClient,
        AnonymousCredential
      } = require('mongodb-stitch-browser-sdk');

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
  };
  
  findInDb = async function (collectionName, query, options){
    try {
      const result = await collectionName.find(query, options).asArray();
      if(result) {
        console.log(`Successfully found document: `,result)
      } else {
        console.log("No document matches the provided query.")
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

  docToArray = function (docs, project) {
    var results = [];
      for (var element of docs) {
        results.push(element[project]);
      }
    console.log(results)
    return results;
  };

}


export default MongoStitch;