const fs = require('fs');
// Read ArgDown code from file
var text = fs.readFileSync('../../../output/argdown/keywordMap.ad').toString('utf-8');
// Put the AD code in an array 
var textByLine = text.split("\n")

// Beginning of the tree code
var treeCode = [];
treeCode.push("import type { TreeData } from '../src/types';");
treeCode.push("import TreeBuilder from './TreeBuilder';")
treeCode.push("export const complexTree: TreeData =")

// Init variables
var nesting = [];
var openBracket = false;

// Loop through AD array and analyse each line
for (line of textByLine){

    var count = line.search(/\S/);

    if(count!=-1){
        analyseLine(line, count);
    }
}

// Once over, close the tree code
if(openBracket){
    treeCode.push(")");
}
treeCode.push(".build();");
// Save to file
console.log(treeCode);
var file = fs.createWriteStream('treeCode.js');
file.on('error', function(err) { /* error handling */ });
file.write(treeCode.join('\n'));
file.end();

// Place a line at the right place with the right index
function analyseLine(line, level){

    const firstCharIndex = level
    const firstChar = line.charAt(firstCharIndex);
    const thirdChar = line.charAt(firstCharIndex+2);
    const indentation = ' '.repeat(level+1);
    const indentationPlus = ' '.repeat(level+2)

    // If it is the first element to be nested at this level create the level
    if (nesting.length <= level){
        nesting.push(0);
    }
    // Increment the number of element in this level
    nesting[level] = nesting[level]+1;

    // If the third non-space char is < then it is an argument
    if(thirdChar=="<"){
        treeCode.push(indentation+".withLeaf("+nesting[level]+")");
    }
    // If the first non-space char is [ then it is an statement
    if(firstChar=="["){
        if (openBracket){
            treeCode.push(indentation+")");
            openBracket=false;
        }
        treeCode.push(indentationPlus+".withSubTree(")
        treeCode.push(indentation+"new TreeBuilder("+nesting[level]+")")
        openBracket=true;
    }
    // If the first char of the line is a # then create then init the first level
    if(firstChar=="#"){
        treeCode.push("new TreeBuilder("+0+")");
    }
}


