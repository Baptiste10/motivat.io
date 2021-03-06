const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID


module.exports = {
  queryAtlas: async function (collectionName, query){
    // Connect to Atlas
    const uri = "mongodb+srv://sgbaudid:vAGdpBKsEx7a9O7z@motivatio-vbs7j.mongodb.net/admin?retryWrites=true";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    
    let result = null;

    await client.connect(async err => {
      var dbo = client.db("mydatabase");
      const collection = dbo.collection(collectionName);
      await collection.find(query).toArray(function(err, res) {
        if (err) throw err;
        client.close();
        console.log("The query returned the following documents:"+res)
        result = res;
      });
    });

    return result;
  },

  insertAtlas: function (collectionName, objArray){
    // Connect to Atlas
    const uri = "mongodb+srv://sgbaudid:vAGdpBKsEx7a9O7z@motivatio-vbs7j.mongodb.net/admin?retryWrites=true";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      var dbo = client.db("mydatabase");
      const collection = dbo.collection(collectionName);
      collection.insertMany(objArray, function(err, result) {
        if (err) throw err;
        console.log("Id of documents inserted: " + result.insertedIds);
        client.close();
        return result;
      });
    });
  }
}

//{ transcript: ObjectId("5c94b80d81a7c32388a3e8ca"), owner: ObjectId("5c94b80d81a7c32388a3e8c8"), '$text': { '$search':'In fact'} }