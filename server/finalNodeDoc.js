function argDownToTree(argDownArray, nodes) {  

    // Init variables
    var nesting = [];
    // Loop through AD array and analyse each line
    for (let line of argDownArray){

        var count = line.search(/\S/);

        if(count!=-1){
            analyseLine(line, count);
        }
    }

    // Place a line at the right place with the right index
    function analyseLine(line, level){

        const firstCharIndex = level
        const firstChar = line.charAt(firstCharIndex);
        const thirdChar = line.charAt(firstCharIndex+2);

        // If it is the first element to be at this level create the level
        if (nesting.length <= level){
            nesting.push(0);
        }
        // Increment the number of element in this level
        nesting[level] = nesting[level]+1;

        // If the third non-space char is < then it is an argument
        if(thirdChar=="<"){
            nodes.doc.parentLevel = level;
            nodes.doc.parentIndex = nesting[level-1]
            nodes.doc.index = nesting[level]
        }
        // If the first non-space char is [ then it is an statement
        if(firstChar=="["){
            nodes.doc.parentLevel = level;
            nodes.doc.parentIndex = nesting[level-1]
            nodes.doc.index = nesting[level]-1
        }
        // If the first char of the line is a # then create then init the first level
        if(firstChar=="#"){
            nodes.doc.parentLevel = null;
            nodes.doc.parentIndex = null
            nodes.doc.index = nesting[level]-1
        }
    }
}
