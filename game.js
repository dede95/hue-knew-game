const grid = document.querySelector('#grid');
const livesTitle = document.querySelector('#lives');
const livesNumber = document.querySelector('#lives span');

const startBtn = document.querySelector('#startGame');
const resetBtn = document.querySelector('#resetGame');
const nextLvlBtn = document.querySelector('#nextLevel');

let currentLevel = 4; // go to level 6x6 but have 20 levels 
let lives = 3;
let gameOver = false;
let disableSquares = false;
const gridnbyn = {};
let randomSqaure;
let colourSqs;



//

const makeBaseColor = () => {
    let rVal = Math.floor(Math.random() * 255) + 1;
    let gVal = Math.floor(Math.random() * 255) + 1;
    let bVal = Math.floor(Math.random() * 255) + 1;

    return [rVal, gVal, bVal, `rgb(${rVal}, ${gVal}, ${bVal})`]
}

const generateGrid = (level) => {
    let sqaures = (level + 1) ** 2;
    for(let i = 0; i < sqaures; i++){
        let sqaure = document.createElement('div');
        sqaure.classList.add('grid-item')//, 'regular');
        grid.appendChild(sqaure);
    }
    grid.style.gridTemplateColumns = `repeat(${level + 1}, 100px [col-start])`;
}

const randomSelectSquare = (gridObj) => {
    let childrenSquares = gridObj.children;
    let chosenSqaure = childrenSquares[Math.floor(Math.random() * childrenSquares.length)];

    // chosenSqaure.classList.toggle('regular') //switch off square for the correct sqaure
    // chosenSqaure.classList.add('correct');
    return chosenSqaure 
}

const adjustColour = (colour) => {
    let adjustedColour;

    // range -4 to 4 
    // let adjusters = [-10, -7, -5, 5, 7, 10];
    let adjuster = 4; //adjusters[Math.floor(Math.random() * adjusters.length)]; 

    // grab only the rgb values from the original base colour
    let colour_vals = colour.slice(0,3);
    colour_vals[Math.floor(Math.random() * colour_vals.length)] += adjuster;
    console.log(colour);
    console.log(colour_vals);

    adjustedColour = `rgb(${colour_vals[0]}, ${colour_vals[1]}, ${colour_vals[2]})`;

    return adjustedColour

}

// LANDING PAGE VIEW - maybe put in start button event 

livesTitle.style.display = 'none';
livesNumber.style.display = 'none';
resetBtn.style.display = 'none';
nextLvlBtn.style.display = 'none';
// grid.style.display = 'none';

function game() {
    generateGrid(currentLevel); // change/reset level and lives in other functions (Reset and next)

    // Select divs after created
    colourSqs = document.querySelectorAll('.grid-item');

    // generate colour array and grab chosen colour
    let chosenColorArray = makeBaseColor();
    let chosenColor = chosenColorArray[chosenColorArray.length - 1];

    for(i = 0; i < colourSqs.length; i++){
        colourSqs[i].style.backgroundColor = chosenColor;
    }
    
    randomSqaure = randomSelectSquare(grid); 
    randomSqaure.style.backgroundColor = adjustColour(chosenColorArray);

    livesNumber.innerHTML = `${lives}`;

    playSqaures(colourSqs);


    
    
}

function playSqaures(gameSqs) {
    gameSqs.forEach(square => {
        square.addEventListener('click', function (e) {
            // return nothing if game over is true for the iteration

            e.stopPropagation();
            if(disableSquares) return;
    
            if (this === randomSqaure) {
                disableSquares = true;
                document.querySelector('h2').innerHTML = 'Correct!';
                randomSqaure.style.borderColor = 'yellow';
                nextLvlBtn.style.display = 'block';
            } else {
                lives--;
                livesNumber.innerHTML = `${lives}`;
                if (lives == 0) {
                    disableSquares = true;
                    gameOver = true;
                    document.querySelector('h2').innerHTML = 'Game over!';
                    randomSqaure.style.borderColor = 'yellow';
                    resetBtn.style.display = 'block';
                }
            }
        });
    });
}


function nextLevel(level) {
    
}

function resetStartOver() {

}


// EVENT LISTENERS

startBtn.addEventListener('click', function (){
    startBtn.style.display = 'none';

    livesTitle.style.display = 'inline-block';
    livesNumber.style.display = 'inline-block';

    game();

    console.log(colourSqs);

})



