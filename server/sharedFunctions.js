// Create the JSON sentence out of its db document
function createSentenceJSON(sentence, typology="", group="") {
    let node = {
      id: sentence['_id'],
      name: sentence['title'],
      text: sentence['text'],
      typology: typology,
      mood: sentence["sentiment"] ? sentence["sentiment"]["mood"] : "",
      group: group,
      title: function() {
        if(this.typology==='statement'){
          let opening = "[";
          let closing = "]";
        }
        if(this.typology==='argument'){
          let opening = "<";
          let closing = ">";
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
    return JSON.stringify(node);
  }

module.exports = createSentenceJSON;