// Client-side : create a set of edges to send to the server

const NodeMaker = require('../src/StitchApp/NodeMaker');
const db = require('./Database')
const queryAtlas = db.queryAtlas;
const insertAtlas = db.insertAtlas;
const createSentenceNode = NodeMaker.createSentenceNode;
const createEdge = NodeMaker.createEdge;
const ObjectId = require('mongodb').ObjectID


async function keywordMap (transcriptId, ownersId, keyword, reverse=false) {
    const transcript = ObjectId(transcriptId)
    const mentionner = ObjectId(ownersId[reverse*1+0]);
    const answerer = ObjectId(ownersId[1-reverse-1]);
    var edges = [];
    const mapObject = {
        type: "KeywordMap",
        transcript: transcript,
        POV: mentionner,
        keyword: keyword
    }

    mapId = await insertAtlas('Maps', [mapObject]) //the function takes an array of docs

    const clauses_with_keyword = await queryAtlas('Clauses', {transcript:transcript, owner: mentionner, $text: {$search: keyword}});
    
    for (let clause of clauses_with_keyword){
        const sentence = await queryAtlas("Clauses", clause.sentence);
        const question = createSentenceNode(sentence, 'statement');
        const match = {transcript: transcriptId, owner:answerer, turn:clause.turn + reverse};
        const answers = await queryAtlas("Sentences", match);

        for (let sentenceAnswer of answers) {
            const answer = createSentenceNode(sentenceAnswer, 'argument', keyword);
            edges.push(createEdge(answer, question, mapId));
        }
    }
}


function keywordMap (transcriptId, ownersId, keyword, reverse=false) {
    const transcript = ObjectId(transcriptId)
    const mentionner = ObjectId(ownersId[reverse*1+0]);
    const answerer = ObjectId(ownersId[1-reverse-1]);
    var edges = [];
    const mapObject = {
        type: "KeywordMap",
        transcript: transcript,
        POV: mentionner,
        keyword: keyword
    }
    insertAtlas('Maps', [mapObject]).then(mapId => {
        queryAtlas('Clauses', {transcript:transcript, owner: mentionner, $text: {$search: keyword}}).then(clauses_with_keyword => {
            for (let clause of clauses_with_keyword){
                queryAtlas("Clauses", clause.sentence).then(sentence => {
                    const question = createSentenceNode(sentence, 'statement');
                    const match = {transcript: transcriptId, owner:answerer, turn:clause.turn + reverse};
                    queryAtlas("Sentences", match).then(answers => {
                        for (let sentenceAnswer of answers) {
                            const answer = createSentenceNode(sentenceAnswer, 'argument', keyword);
                            edges.push(createEdge(answer, question, mapId));
                        }
                    })
                }) 
            }
        })
    })    
}

keywordMap('5c94b80d81a7c32388a3e8ca', ["5c94b80d81a7c32388a3e8ca", '5c94b80d81a7c32388a3e8c8'], 'work')