let mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

const SERVER = '127.0.0.1:27017'; // DB SERVER
const DATABASE = 'mydatabase';    // DB NAME

class Database {
    constructor() {
      this._connectMongo();
    };

    // Initialize connection to Mongodb
    _connectMongo() {
        //Set up mongoose connection
        mongoose.connect(`mongodb://${SERVER}/${DATABASE}`, { useNewUrlParser: true }, { autoIndex: false })
        // mongoose.Promise = global.Promise;
        this.db = mongoose.connection;
    
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
        // Collection Schemas and models
        const Schema = mongoose.Schema;
        this.Transcripts = mongoose.model("Transcripts", new Schema({}), "Transcripts");
        this.Sentences = mongoose.model("Sentences", new Schema({}), "Sentences");
        this.Clauses = mongoose.model("Clauses", new Schema({}), "Clauses");
    };

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
};


let mongo = new Database();
mongo.execQuery(mongo.Clauses, {transcript: ObjectId('5c8ce77e81a7c3221c80f862'), owner: ObjectId('5c8ce77e81a7c3221c80f860'), tense:'pres'}, 'text').then(console.log)

module.exports = Database;