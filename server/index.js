// Server
const express = require('express')

let mongoose = require('mongoose');
const Transcripts = require('./models/transcriptSchema.js')

const SERVER = '127.0.0.1:27017'; // DB SERVER
const DATABASE = 'mydatabase';    // DB NAME

//Set up mongoose connection
mongoose.connect(`mongodb://${SERVER}/${DATABASE}`, { useNewUrlParser: true })
// mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    const app = express();

    app.get('/', (req, res) => {
        Transcripts.find(function(err, docs) {
            console.log(docs);
            res.send('done');
        })
    });
    
    // Potential useful methods to use:
    // res.download()	Prompt a file to be downloaded: to get the ArgDown
    // res.json()	Send a JSON response: for the sentences from the db
    
    
    app.listen(3000, () => {
        console.log('Listening on port 3000.')
    })
})

