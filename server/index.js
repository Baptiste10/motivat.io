// Server
import express from 'express'

import DatabaseManager from './databaseManager'

const db = DatabaseManager();

const app = express();

app.get('/', (req, res) => {
    res.send('hello')
});

app.listen(3000, () => {
    console.log('Listening on port 3000.')
})