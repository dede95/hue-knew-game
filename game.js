const grid = document.querySelector('#grid');
const livesTitle = document.querySelector('#lives');
const livesNumber = document.querySelector('#lives span');
let addLife = document.createElement('p');

const startBtn = document.querySelector('#startGame');
const resetBtn = document.querySelector('#resetGame');
const nextLvlBtn = document.querySelector('#nextLevel');

let currentLevel = 1; // go to level 6x6 but have 20 levels 
let lives = 3;
let gameOver = false;
let disableSquares = false;
const gridnbyn = {};
let randomSqaure;
let colourSqs;
let gameData = null;

// load gameData
gameData = {
    "1": {"size": 1, "adjust":20},
    "2": {"size": 1, "adjust":18}, 
    "3": {"size": 1, "adjust":14}, 
    "4": {"size": 1, "adjust":12}, 
    "5": {"size": 2, "adjust":18}, 
    "6": {"size": 2, "adjust":16},
    "7": {"size": 2, "adjust":14},
    "8": {"size": 2, "adjust":12},
    "9": {"size": 2, "adjust":10},
    "10": {"size": 3, "adjust":14},
    "11": {"size": 3, "adjust":12},
    "12": {"size": 3, "adjust":12},
    "13": {"size": 3, "adjust":10},
    "14": {"size": 3, "adjust": 8},
    "15": {"size": 4, "adjust": 12},
    "16": {"size": 4, "adjust": 10},
    "17": {"size": 4, "adjust": 8},
    "18": {"size": 4, "adjust": 8},
    "19": {"size": 4, "adjust": 6},
    "20": {"size": 4, "adjust": 6}, 
    "21": {"size": 5, "adjust": 14}, 
    "22": {"size": 5, "adjust": 14}, 
    "23": {"size": 5, "adjust": 12}, 
    "24": {"size": 5, "adjust": 10}, 
    "25": {"size": 5, "adjust": 8}, 
    "26": {"size": 5, "adjust": 8}, 
    "27": {"size": 5, "adjust": 6}, 
    "28": {"size": 5, "adjust": 6}, 
    "29": {"size": 5, "adjust": 4}, 
    "30": {"size": 5, "adjust": 4}
};

// CORE FUNCTIONS

/**
 * makeBaseColor: Generates a random RGB base colour (later applied to chosen object), containing the individual values and the string format
 * @returns {Array} An array of the individual RGB values and the string version i.e. [int, int, int, string]
 */
const makeBaseColor = () => {
    let rVal = Math.floor(Math.random() * 255) + 1;
    let gVal = Math.floor(Math.random() * 255) + 1;
    let bVal = Math.floor(Math.random() * 255) + 1;

    return [rVal, gVal, bVal, `rgb(${rVal}, ${gVal}, ${bVal})`]
}

/**
 * generateGrid: Creates a grid of sqaures - given a squared value, created empty divs 
 * and is appended to the document. 
 * This is then formatted in a grid pattern using CSS grid
 * @param {string or int} size - 
 */
const generateGrid = (size) => {
    let sqaures = (size + 1) ** 2;
    for(let i = 0; i < sqaures; i++){
        let sqaure = document.createElement('div');
        sqaure.classList.add('grid-item')//, 'regular');
        grid.appendChild(sqaure);
    }
    grid.style.gridTemplateColumns = `repeat(${size + 1}, 100px [col-start])`;
}

/**
 * randomSelectSquare: Selects a random child of a queried object (in this case "grid")
 * @param {Object} gridObj - a queried object
 * @returns - a selected child of the queried object
 */
const randomSelectSquare = (gridObj) => {
    let childrenSquares = gridObj.children;
    let chosenSqaure = childrenSquares[Math.floor(Math.random() * childrenSquares.length)];

    return chosenSqaure 
}

/**
 * adjustColour: Adjusts the chosen base for a target object by randomly select R, G or B to be adjusted
 * @param {Array} colour - an array of the individual RGB values and the string format i.e. [int, int, int, string]
 * @param {Int} level - the current level of the game; the key for the gameData object
 * @returns The string form of the adjusted RBG colour
 */
const adjustColour = (colour, level) => {
    let adjustedColour;

    let adjuster = gameData[level]["adjust"]; //adjusters[Math.floor(Math.random() * adjusters.length)]; 

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

function game(level, size) {
    generateGrid(size); // change/reset level and lives in other functions (Reset and next)

    // Select divs after created
    colourSqs = document.querySelectorAll('.grid-item');

    // generate colour array and grab chosen colour
    let chosenColorArray = makeBaseColor();
    let chosenColor = chosenColorArray[chosenColorArray.length - 1];

    for(i = 0; i < colourSqs.length; i++){
        colourSqs[i].style.backgroundColor = chosenColor;
        colourSqs[i].style.borderColor = 'black';
    }
    
    randomSqaure = randomSelectSquare(grid); 
    randomSqaure.style.backgroundColor = adjustColour(chosenColorArray, level);

    // add starting lives to view
    livesNumber.innerHTML = `${lives}`;

    playSqaures(colourSqs);
    
    // add extra life at checkpoint
    if (level % 5 == 0) {
        lives++;
        addLife.innerHTML = 'You gained an extra life!'
        document.body.appendChild(addLife);
    } else {
        addLife.remove();
    }
}

/**
 * playSqaures: Event applied to each child object to:
 * 1. Return nothing if disabled Sqaures is true (based on the following)
 * 2. If the chosen sqaure the user selects is the target/correct square:
 *      a. disable sqaures, notify user of correct answer
 *      b. display next level button to move onto the next round
 * 3. Else, lose a life and notify user of wrong answer
 *      a. if lives is 0, disable sqaures and end the game, 
 *      b. display reset game button 
 * @param {Object} gameSqs - the HTML Collection object of the generated grid sqaures 
 */
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
                // currentLevel++;
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

// EVENT LISTENERS

startBtn.addEventListener('click', function (){
    startBtn.style.display = 'none';
    livesTitle.style.display = 'inline-block';
    livesNumber.style.display = 'inline-block';

    game(currentLevel, gameData[currentLevel]['size']);

    console.log(colourSqs);

});


nextLvlBtn.addEventListener('click', () => {
    nextLvlBtn.style.display = 'none'; 
    currentLevel++;

    //reset for next level
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(e => e.remove());
    document.querySelector('h2').innerHTML = '';
    disableSquares = false;

    game(currentLevel, gameData[currentLevel]['size']);
    console.log(currentLevel);
});

resetBtn.addEventListener('click', () => {
    resetBtn.style.display = 'none';
    currentLevel = 1;
    lives = 3;

    //reset game back to level 1
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(e => e.remove());
    document.querySelector('h2').innerHTML = '';
    disableSquares = false;
    game(currentLevel, gameData[currentLevel]['size']);
});


