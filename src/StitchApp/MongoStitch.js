async function MongoStitch() {
  const BSON = require('bson');
  const {
          Stitch,
          RemoteMongoClient,
          AnonymousCredential
        } = require('mongodb-stitch-browser-sdk');

  const stitchApp = await Stitch.initializeDefaultAppClient("motivatiio-zkwky");
  const mongodb = await stitchApp.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
  const db = mongodb.db('mydatabase');
  const user = await stitchApp.auth.loginWithCredential(new AnonymousCredential());
  console.log(`Logged in as anonymous user with id: ${user.id}`);

  const Transcripts = await db.collection("Transcripts");

  async function findInDb(collectionName, query, options){
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

  async function getAllTranscripts () {
    const query = {};
    const project = "name";
    const options = {"projection": {name: 1}};
    const docs = await findInDb(Transcripts, query, options );
    const transcriptsName = await docToArray(docs, project);
    return transcriptsName
  };

  async function getTranscriptId(transcriptName){
    const query = {'name': transcriptName};
    const project = "_id";
    const options = {"projection": {_id: 1}};
    const docs = await findInDb(Transcripts, query, options );
    const transcriptId = await docToArray(docs, project);
    console.log('TR ID FOUND: ', transcriptId[0].toString())
    return transcriptId[0].toString()
  };

/*
  async function getTranscriptOwners(transcriptId){
    const query = {'_id': transcriptName};
    const project = "name";
    const options = {"projection": {_id: 1}};
    const docs = await findInDb(Transcripts, query, options );
    const transcriptsId = await docToArray(docs, project);
    return transcriptsId
  };
*/

  function docToArray(docs, project) {
    var results = [];
      for (var element of docs) {
        results.push(element[project]);
      }
    return results;
  };

  return getTranscriptId('Monday 6th July');

}


export default MongoStitch;