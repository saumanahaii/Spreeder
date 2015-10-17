$(document).ready(function(){

  function AppViewModel(){
    theString = ko.observable("MacLeod was born in Stornoway, Scotland on 2 August 1954. He graduated from Glasgow University with a degree in zoology and has worked as a computer programmer and written a masters thesis on biomechanics. He was a Trotskyist activist in the 1970s and early 1980s and is married and has two children He lives in South Queensferry near Edinburgh.");
    textAreaString = ko.observable("Paste what you want to speed read here.  The application will Spreed it for you.");
    //the array of spreeder boxes
    spreederArray = ko.observableArray();
    var processedString = ko.observableArray();
    //this is the spreedBox element.  Each one has an array of words,
    //a color array and a default color position
    var spreedBox = {
      colors: ["#99FFCC", "#6AE6B8"]
    }

    //processes each sentence into an array with three words each
    this.processString = function(string){
      string = string.replace(/\.\ /g, ".");
      var stringArray = string.split(".");
      var processedArray = [];
      //Runs through each string.
      //stringArray contains the top level strings to be processed
      for (i=0;i<stringArray.length-1;i++){
        //run through the current string and create an array of every
        //three words.
        workingString = stringArray[i].split(" ");
        tempArray=[];
        returnArray = []
        count = 0;
        //goes through each element in the string
        //Count to three and add to tempArray
        for (e=0;e<workingString.length;e++){
          currentArrayLocation = Math.floor(e/3);
          if (!returnArray[currentArrayLocation]){
            returnArray[currentArrayLocation] = []
          }
          returnArray[currentArrayLocation].push(workingString[e]);
        }
        processedArray.push(returnArray);
      }


      //return the processed array.  It is now an array of sentence arrays.
      return processedArray;
    };
    this.makeBoxes = function(){
      spreederArray([]);
      processedString(this.processString(theString()));
      //console.log(processedString());
      //iterate over each of the sentences in the array
      for (i=0;i<processedString().length;i++){
        var current = processedString()[i];
        //iterate over each of the arrays that make up the sentences
        for (e=0;e<current.length;e++){
          var boxArray = current[e];
          var theBox = Object.create(spreedBox);
          theBox.words = boxArray;
          if (e % 2 != 0){
            theBox.theColor =  ko.observable(theBox.__proto__.colors[0]);
          } else {
            theBox.theColor = ko.observable(theBox.__proto__.colors[1]);
          }
          theBox.currentWord = ko.observable(theBox.words[0]);
          spreederArray.push(theBox);
        }
        //---this line breaks the application.  Sort it out later!
        //spreederArray().push("break");
      }
      console.log(spreederArray());
    }


    //update the string function and rerender the boxes
    this.updateString= function(){
      theString(textAreaString());
      this.makeBoxes();

    }

    //the code that controls the intervals
    var currentCount = 0
    setInterval(function(){
      for (i=0;i<spreederArray().length;i++){
        spreederArray()[i].currentWord(spreederArray()[i].words[currentCount])
        if (spreederArray()[i].currentWord() == null){
          spreederArray()[i].currentWord("_")
        }
      }
      currentCount +=1;
      if(currentCount >=3){
        for (i=0;i<spreederArray().length-1;i++){
          if (spreederArray()[i].theColor() == spreederArray()[i].__proto__.colors[0]){
            spreederArray()[i].theColor(spreederArray()[i].__proto__.colors[1]);
          }
          else {
            spreederArray()[i].theColor(spreederArray()[i].__proto__.colors[0]);
          }
        }
        currentCount = 0;
      }
    }, 300);

    this.makeBoxes();
  }

ko.applyBindings(new AppViewModel());

});
