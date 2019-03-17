async function searchHandler(searchParameters) {
    // -----------Declare search parameters ------------
    let text = searchParameters.split('_').join(' ');
    let namedEntity = "";
    let keywords = ""
    let match = {};
    let project = "";
    match.transcript = "5c8ce77e81a7c3221c80f862";
    match.owner = "5c8ce77e81a7c3221c80f861";

    /*
    if (searchParameters[this.activeTalkType] != 'all') {
      match.type = searchParameters[this.activeTalkType]
    };
    if (searchParameters[this.activeSubType] != 'all') {
      match.subtype = searchParameters[this.activeSubType]
    };
    */

    // ------------- Extract hashtags -------------
    
    // Save hashtags in a list
    let hashtags = []
    var myRegexp = /#([\w-]+)/gi;
    aMatch = myRegexp.exec(text);
    while (aMatch != null) {
      hashtags.push(aMatch[1])
      aMatch = myRegexp.exec(text);
    }
    // Remove hashtags from string
    text = text.replace(/#([\w-]+)/gi,"");
  
    // Assume remaining text are normal keywords
    keywords = text.replace(/\s\s+/g, ' ');
    match.$text = {$search: keywords};

    console.log(hashtags, keywords, match)
  
    // ------------ Identify hashtags -------------
  
    for (var hashtag of hashtags) {
      if (hashtag == hashtag.toUpperCase()){
        console.log("UP")
        // return sentences involving his named entity category
        match.tags = hashtag;
      }else {
          console.log("LO")
          if (hashtag === 'pos' || hashtag === 'neg') {
            // return sentences with the mentionned sentiment
            match.sentimentMood = hashtag;
            continue;
          }
          if (hashtag === 'pres' || hashtag === 'past'){
            // return sentences with the mentionned tense
            match.tense = hashtag;
            continue;
          }
      }
    }
  
    project = "sentence";
    console.log(match)
}

searchHandler("work_at_home_#pres_#pos_something_else_#PERSON")