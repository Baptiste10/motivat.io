async function MongoStitch() {
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
      const result = await collectionName.findOne(query, options);
      if(result) {
        console.log(`Successfully found document: ${result}.`)
      } else {
        console.log("No document matches the provided query.")
      } 
      }catch(e) {
        console.log(e);
      }
  }

  const query = {"name": "Monday 6th July"};
  const options = { "limit": 1 };
  findInDb(Transcripts, query, options ); 

}

export default MongoStitch