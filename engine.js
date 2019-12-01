//Global Vars
var tile_matrix = new Array(4);
var moveCount = 0;
var character = Math.floor(Math.random() * 3);
var puzzleStyles = ["bowser","mario","peach"];
var backgroundarray = ["background2.png","background3.png","background4.png","background5.png","background.png"];

var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;
var stopped = false;
var running = false;

function ChangeBackground(){
    var i = Math.floor(Math.random() * 5);
    document.body.style.backgroundImage = "url("+backgroundarray[i]+")";
}

function ChangePuzzle(){
    var character = Math.floor(Math.random() * 3);
    for(var i=1;i<=15;i++){
        document.getElementById(`tile_${i}`).style.backgroundImage = `url(./${puzzleStyles[character]}/${i}.jpg)`;
    }
}

//Populate HTML with tiles
function CreateGrid(){
    
    //Create blank 2d tile_matrix
    for (var i=0; i<tile_matrix.length; i++){
        tile_matrix[i]= new Array(4);
    }
    //Generate HTML elements for tiles 1-15
    var h = 0;
    for (var i=0; i<4; i++){
        for (var j=0; j<4; j++){
            tile_matrix[i][j] = h+1;
            document.getElementById('grid').innerHTML +='<div id="tile_'+tile_matrix[i][j]+'">'+tile_matrix[i][j]+'</div>';
            h = h+1;
        }
    }

    //Call shuffle
    Shuffle()
    ChangePuzzle()
}

//Shuffle override
Array.prototype.array_shuffle = function(){
    var temp;
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < this.length; j++) {
            var m = Math.floor(Math.random() * (this.length));
            var n =  Math.floor(Math.random() * (this.length));
            
            temp = this[i][j];
            this[i][j] = this[m][n];
            this[m][n] = temp;
        }
    }
}

//Shuffle main call
function Shuffle(){
    resetTimer();
    resetMoveCount();
    tile_matrix.array_shuffle();
    document.getElementById('grid').innerHTML="";
    for (var i=0; i<4; i++){
        for (var j=0; j<4; j++){					
            document.getElementById('grid').innerHTML +='<div onClick="TilePressed(this,'+tile_matrix[i][j]+')" id="tile_'+tile_matrix[i][j]+'">'+tile_matrix[i][j]+'</div>';
            if(tile_matrix[i][j]!=16){
                document.getElementById(`tile_${tile_matrix[i][j]}`).style.backgroundImage = `url(./${puzzleStyles[character]}/${tile_matrix[i][j]}.jpg)`;
            }
        }
    }
}

//Tile action
function TilePressed(currentTile,currentTileVal){

    //Selected tile attributes
    var currentTile_position = getIndexOf(tile_matrix,currentTileVal);
    var currentTile_row = currentTile_position[0];
    var currentTile_col = currentTile_position[1];

    //Get current transform property values
    if (currentTile.style.transform != ''){
        var transformProps = currentTile.style.transform.match(/[\d -]+/g)
        var currentTile_transform_x = parseInt(transformProps[0])
        var currentTile_transform_y = parseInt(transformProps[1])
    }

    else {
        var currentTile_transform_x = 0
        var currentTile_transform_y = 0
    }

    console.log('Current tile transform values: ' + currentTile_transform_x + ',' + currentTile_transform_y)

    //Blank tile attributes
    var blankTile = document.getElementById("tile_16")
    var blankTileVal = 16;
    var blankTile_position = getIndexOf(tile_matrix,blankTileVal);
    var blankTile_row = blankTile_position[0];
    var blankTile_col = blankTile_position[1];

    //Get current transform property values
    if (blankTile.style.transform != ''){
        var blankTile_transformProps = blankTile.style.transform.match(/[\d -]+/g)
        var blankTile_transform_x = parseInt(blankTile_transformProps[0])
        var blankTile_transform_y = parseInt(blankTile_transformProps[1])
    }

    else {
        var blankTile_transform_x = 0
        var blankTile_transform_y = 0
    }

    console.log('Blank tile transform values: ' + blankTile_transform_x + ',' + blankTile_transform_y)

    //If the blank tile row is above or below current row
    if( (currentTile_row+1 == blankTile_row) || (currentTile_row-1 == blankTile_row) ){

        if(currentTile_col == blankTile_col){

            //Blank is above | Current is Below
            if(((currentTile_row)-(blankTile_row))>0){
                currentTile.style.transform = `translate(${currentTile_transform_x}px,${currentTile_transform_y - 120}px)`
                blankTile.style.transform = `translate(${blankTile_transform_x}px,${blankTile_transform_y + 120}px)`;
            }

            //Blank is below | Current is above
            else{
                currentTile.style.transform = `translate(${currentTile_transform_x}px,${currentTile_transform_y + 120}px)`
                blankTile.style.transform = `translate(${blankTile_transform_x}px,${blankTile_transform_y - 120}px)`;
            }

            //Swap tile_matrix values in board matrix
            var temp = tile_matrix[blankTile_row][blankTile_col];
            tile_matrix[blankTile_row][blankTile_col] = tile_matrix[currentTile_row][currentTile_col];
            tile_matrix[currentTile_row][currentTile_col] = temp;

            incrementMoveCount();    
        }
    }

    //If the blank tile column is on either side of current column 
    else if( (currentTile_col+1 == blankTile_col) || (currentTile_col-1==blankTile_col) ){

        if(currentTile_row == blankTile_row){
            //Blank is on left | Current is on right
            if((currentTile_col-blankTile_col)>0){
                currentTile.style.transform = `translate(${currentTile_transform_x - 120}px,${currentTile_transform_y}px)`
                blankTile.style.transform = `translate(${blankTile_transform_x + 120}px,${blankTile_transform_y}px)`
            }

            //Blank is on right | Current is on left
            else{
                currentTile.style.transform = `translate(${currentTile_transform_x + 120}px,${currentTile_transform_y}px)`
                blankTile.style.transform = `translate(${blankTile_transform_x - 120}px,${blankTile_transform_y}px)`
            }

            //Swap tile_matrix values in board matrix
            var temp = tile_matrix[blankTile_row][blankTile_col];
            tile_matrix[blankTile_row][blankTile_col] = tile_matrix[currentTile_row][currentTile_col];
            tile_matrix[currentTile_row][currentTile_col] = temp;

            incrementMoveCount();    
        }
    }

    //Chosen tile and blank tile are not adjacent in any way
    else {
        document.getElementById("message").innerHTML = "This tile cannot be moved";
    }

    //Check to see if move solved the puzzle
    if(isSolved()) {
        stopTimer();
        alert('Congrats! You solved the puzzle!')
        console.log("Solved")
    }
    else console.log("Not yet solved")

}

function getIndexOf(arr,k){
    for (var i=0; i<arr.length; i++){
        var index = arr[i].indexOf(k);
        if (index>-1){
            return [i,index];
        }
    }
}

function isSolved(){
    var prev = 0
    for(var i=0; i<tile_matrix.length; i++){
        var start = tile_matrix[i][0]
        for(var j=0; j<tile_matrix.length; j++){
            if(tile_matrix[i][j] != start+j) return false;
        }
    }
    return true;
}

function incrementMoveCount(){
    moveCount++
    console.log('Move count: ' + moveCount)
    if(!running) startTimer()
    document.getElementById("moveCount").innerHTML = moveCount
    return;
}

function resetMoveCount(){
    moveCount = 0
    document.getElementById("moveCount").innerHTML = moveCount
}

function startTimer(){
    console.log('Timer start method hit');
    if(!running){
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1);
        stopped = false;
        running = true;        
    }
}

function stopTimer(){
    if(!difference){}
    else if (!stopped){
        clearInterval(tInterval);
        savedTime = difference;
        stopped = true;
        running = false;
    }
    else {
        startTimer();
    }
}

function resetTimer(){
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    stopped = false
    running = false
    document.getElementById("timer").innerHTML = '00:00:00';
}

function getShowTime(){

    updatedTime = new Date().getTime();
    if(savedTime){
        difference = (updatedTime - startTime) + savedTime;
    }
    else {
        difference = updatedTime - startTime;
    }

    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    var milliseconds = Math.floor((difference % (1000 * 60)) / 100);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
    document.getElementById("timer").innerHTML = minutes + ':' + seconds + ':' + milliseconds;
}
