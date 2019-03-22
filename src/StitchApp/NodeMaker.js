// Create the JSON sentence out of its db document
module.exports = {
  createSentenceNode : function (sentence, typology="", group="") {
    let node = {
      id: sentence._id,
      turn: sentence.turn,
      name: sentence.title,
      text: sentence.text,
      typology: typology,
      sentiment: sentence.sentiment,
      group: group,
      title: function() {
        var opening;
        var closing;
        if(this.typology==='statement'){
          opening = "[";
          closing = "]";
        }
        if(this.typology==='argument'){
          opening = "<";
          closing = ">";
        }
        return opening+this.name+closing;
      },
      body: function(){
        let colon = ": ";
        return colon+this.text;
      },
      completeNode: function(){
        return this.title()+this.body()
      },
      relation: function(){
        if(this.sentiment === 'pos'){
          return "+ ";
        }
        if(this.sentiment === 'neg'){
          return "- ";
        }
      }
    }
    console.log(node);
    return node;
  },

  createClauseNode: function (clause) {
    let node = {
      id: clause['_id'],
      text: clause['text'],
      type: clause['type'],
      subtype: clause['subtype'],
      subject: clause['subject'],
      tense: clause['tense'],
      sentiment: clause['sentiment']['mood'],
      tags: clause['tags'],
      fav: false
    }
    return node
  }
}