const NodeMaker = require('./NodeMaker');
const createSentenceNode = NodeMaker.createSentenceNode;
const createEdge = NodeMaker.createEdge;

class Maps{
    constructor(db, transcriptId, ownersId) {
        this.db = db;
        this.transcriptId = transcriptId;
        this.ownersId = ownersId;
    };

    async keywordMap (keyword, reverse=false) {
        const mentionner = this.ownersId[reverse*1+0];
        const answerer = this.ownersId[1-reverse-1];
        var edges = [];
        const clauses_with_keyword = await this.db.searchForKeyword(keyword, mentionner);

        for (let clause of clauses_with_keyword){
            const sentence = await this.db.findInDb(this.db.Clauses, clause.sentence);
            const question = createSentenceNode(sentence, 'statement');
            const match = {transcript: this.transcriptId, owner:answerer, turn:clause.turn + reverse};
            const answers = await this.db.findInDb(this.db.Sentences, match);

            for (let sentenceAnswer of answers) {
                const answer = createSentenceNode(sentenceAnswer, 'argument', keyword);
                edges.push(createEdge(answer, question));
            }
        }
    }

    MIMap = async function () {}
}

export default Maps;