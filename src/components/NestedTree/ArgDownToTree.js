const fs = require('fs');
const path = '../../../output/argdown/'

function argDownToTree(mapName) {   

    // Read ArgDown code from file
    var text = fs.readFileSync(path+mapName+".ad").toString('utf-8');
    // Put the AD code in an array 
    var textByLine = text.split("\n")

    // Beginning of the tree code
    var treeCode = [];
    // Conversion table
    var conversionTable = [];
    treeCode.push("import type { TreeData } from '../src/types';");
    treeCode.push("import TreeBuilder from './TreeBuilder';")
    treeCode.push("export const complexTree: TreeData =")

    // Init variables
    var nesting = [];
    var openBracket = false;

    // Loop through AD array and analyse each line
    for (let line of textByLine){

        var count = line.search(/\S/);

        if(count!=-1){
            analyseLine(line, count);
        }else{
            conversionTable.push({content:'', parentId: null, index:null})
        }
    }

    // Once over, close the tree code
    if(openBracket){
        treeCode.push(")");
    }
    treeCode.push(".build();");

    // Save to Tree file
    var file = fs.createWriteStream(path+mapName+'.js');
    file.on('error', function(err) { /* error handling */ });
    file.write(treeCode.join('\n'));
    file.end();

    //Save the conversion table
    jsonConvertionTable = JSON.stringify(conversionTable);
    var file = fs.createWriteStream(path+mapName+'.json');
    file.on('error', function(err) { /* error handling */ });
    file.write(jsonConvertionTable);
    file.end();


    // Place a line at the right place with the right index
    function analyseLine(line, level){

        const firstCharIndex = level
        const firstChar = line.charAt(firstCharIndex);
        const thirdChar = line.charAt(firstCharIndex+2);
        const indentation = ' '.repeat(level+1);
        const indentationPlus = ' '.repeat(level+2)
        var title = '';

        // If it is the first element to be nested at this level create the level
        if (nesting.length <= level){
            nesting.push(0);
        }
        // Increment the number of element in this level
        nesting[level] = nesting[level]+1;

        // If the third non-space char is < then it is an argument
        if(thirdChar=="<"){
            title = line.match(/\<([^)]+)\>/)[1]
            treeCode.push(indentation+".withLeaf("+nesting[level]+", \""+title+"\")");
            conversionTable.push({content:title, parentId:{level:level, index:nesting[level-1]}, index:nesting[level]})
        }
        // If the first non-space char is [ then it is an statement
        if(firstChar=="["){
            if (openBracket){
                treeCode.push(indentation+")");
                openBracket=false;
            }
            title = line.match(/\[([^)]+)\]/)[1]
            treeCode.push(indentationPlus+".withSubTree(")
            treeCode.push(indentation+"new TreeBuilder("+nesting[level]+", \""+title+"\")")
            openBracket=true;
            conversionTable.push({content:title, parentId:{level:level, index:nesting[level-1]}, index:nesting[level]-1})
        }
        // If the first char of the line is a # then create then init the first level
        if(firstChar=="#"){
            title = line.match(/\#(.*)/)[1]
            treeCode.push("new TreeBuilder("+0+", \""+title+"\")");
            conversionTable.push({content:title, parentId:{level:null, index:null}, index:nesting[level]-1})
        }
    }
}

function updateTree(source, destination, mapName){

    // Read conversion table code from file
    var text = fs.readFileSync(path+mapName+".json").toString('utf-8');
    var conversionTable = JSON.parse(text);

    // get source level and index of parent
    var sourceParent = source.parentId;
    var parentSourceLevel;
    var parentSourceIndex=false;
    if(sourceParent.length>0){
        let s = sourceParent.search("-");
        if(s==-1){parentSourceLevel = parseInt(sourceParent);}
        else{
            parentSourceLevel = parseInt(sourceParent.substring(0,s));
            parentSourceIndex = parseInt(sourceParent.substring(s+1, sourceParent.length));
        }
    }

    // get destination level and index of parent
    var destinationParent = destination.parentId;
    var parentDestinationLevel;
    var parentDestinationIndex=false;
    if(destinationParent.length>0){
        let s = destinationParent.search("-");
        if(s==-1){parentDestinationLevel = parseInt(destinationParent);}
        else{
            parentDestinationLevel = parseInt(destinationParent.substring(0,s));
            parentDestinationIndex = parseInt(destinationParent.substring(s+1, destinationParent.length));
        }
    }

    for (let line of conversionTable) {
        if (line.parentId!==null && line.parentId.level == parentSourceLevel && line.parentId.index == parentSourceIndex && line.index == source.index){
            
            line.parentId.level = parentDestinationLevel;
            line.parentId.index = parentDestinationIndex;
            line.index = destination.index;
            
        }
    }
}

updateTree({parentId:"1-18", index:25}, {parentId:"1-14", index:19},'Keyword Map from Mrs Benjamin POV');
