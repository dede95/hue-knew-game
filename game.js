// START SCREEN

startScreen = document.querySelector('.start-screen');
mainGame = document.querySelector('.game-play');

gsap.registerPlugin(SplitText);
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

function randomBtwn(min, max){
    return Math.random() *(max-min) + min;
}

let circles = [];
const colours = ["rgba(95, 95, 255, 0.8)", "rgba(241, 53, 182, 0.8)", "rgba(200, 255, 0, 0.9)"];
document.body.style.backgroundColor = "rgba(253, 255, 149, 0.8)";

function initCircles(){
    circles = [];

    let circleCount = window.innerWidth / 100;
    for (let i = 0; i < circleCount; i++) {
        let radius = window.innerWidth / 6;
        let x = randomBtwn(radius, canvas.width - radius);
        let y = randomBtwn(radius, canvas.height - radius);
        let dx = randomBtwn(window.innerWidth / -2000, window.innerWidth / 2000);
        let dy = randomBtwn(window.innerWidth / -2000, window.innerWidth / 2000);
        let colour = colours[Math.floor(Math.random() * colours.length)];
        circles.push({x, y, dx, dy, radius, colour});
    }
}

function drawCircles(circle){
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2, false); 
    ctx.fillStyle = circle.colour;
    ctx.fill();
    ctx.closePath();
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width, canvas.height);

    circles.forEach(circle => {
        if (circle.x + circle.radius > canvas.width || circle.x - circle.radius <0) {
            circle.dx = -circle.dx;
        }
        if (circle.y + circle.radius > canvas.height || circle.y - circle.radius <0) {
            circle.dy = -circle.dy;
        }
        circle.x += circle.dx;
        circle.y += circle.dy;
        drawCircles(circle);
    });
}

function resizeCanvas(){
    canvas.width = window.innerWidth * 1.5;
    canvas.height = window.innerHeight * 1.5;
    initCircles();
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);
initCircles();
animate();

// GSAP FONT ANIMATION
document.fonts.ready.then(() => {
    SplitText.create(".main-text", {
        type:"chars, words, lines", 
        mask: "chars",
        onSplit: (self) => {
            gsap.from(self.chars, {
                y: 100,
                autoAlpha:0, 
                duration:0.4,
                stagger: {
                    amount: 0.4
                }
            }); 
        }
    });
});

// MAIN GAME

const grid = document.querySelector('#grid');
const livesTitle = document.querySelector('#lives');
const livesNumber = document.querySelector('#lives span');
let addLife = document.createElement('p');
const roundsText = document.querySelector('#rounds');
let roundsNumber = document.querySelector('#rounds span');

const startBtn = document.querySelector('#startGame');
const resetBtn = document.querySelector('#resetGame');
const nextLvlBtn = document.querySelector('#nextLevel');

resetBtn.classList.add('disabledbutton');

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
    "1": {"size": 1, "adjust":18},
    "2": {"size": 1, "adjust":16}, 
    "3": {"size": 1, "adjust":14}, 
    "4": {"size": 1, "adjust":12}, 
    "5": {"size": 2, "adjust":14}, 
    "6": {"size": 2, "adjust":12},
    "7": {"size": 2, "adjust":10},
    "8": {"size": 2, "adjust":10},
    "9": {"size": 2, "adjust":8},
    "10": {"size": 3, "adjust":12},
    "11": {"size": 3, "adjust":12},
    "12": {"size": 3, "adjust":10},
    "13": {"size": 3, "adjust":8},
    "14": {"size": 3, "adjust": 6},
    "15": {"size": 4, "adjust": 10},
    "16": {"size": 4, "adjust": 10},
    "17": {"size": 4, "adjust": 8},
    "18": {"size": 4, "adjust": 8},
    "19": {"size": 4, "adjust": 6},
    "20": {"size": 4, "adjust": 6}, 
    "21": {"size": 5, "adjust": 8}, 
    "22": {"size": 5, "adjust": 8}, 
    "23": {"size": 5, "adjust": 7}, 
    "24": {"size": 5, "adjust": 7}, 
    "25": {"size": 5, "adjust": 6}, 
    "26": {"size": 5, "adjust": 6}, 
    "27": {"size": 5, "adjust": 6}, 
    "28": {"size": 5, "adjust": 4}, 
    "29": {"size": 5, "adjust": 4}, 
    "30": {"size": 5, "adjust": 4},
    "31": {"size": 6, "adjust": 4}, 
    "32": {"size": 6, "adjust": 4}, 
    "33": {"size": 6, "adjust": 4},
    "34": {"size": 6, "adjust": 4},
    "35": {"size": 6, "adjust": 4},
    "36": {"size": 6, "adjust": 4},
    "37": {"size": 6, "adjust": 4},
    "38": {"size": 6, "adjust": 3},
    "39": {"size": 6, "adjust": 3},
    "40": {"size": 6, "adjust": 3}
};

// CORE FUNCTIONS

/**
 * makeBaseColor: Generates a random RGB base colour (later applied to chosen object), containing the individual values and the string format
 * @returns {Array} An array of the individual RGB values and the string version i.e. [int, int, int, string]
 */
const makeBaseColor = () => {
    //select range of colours that are not too harsh
    let rVal = Math.floor(Math.random() * 150) + 50;
    let gVal = Math.floor(Math.random() * 150) + 50;
    let bVal = Math.floor(Math.random() * 150) + 50;

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
    grid.style.gridTemplateColumns = `repeat(${size + 1}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size + 1}, 1fr)`;
    for(let i = 0; i < sqaures; i++){
        let sqaure = document.createElement('div');
        sqaure.classList.add('grid-item')//, 'regular');
        grid.appendChild(sqaure);
        //adding staggering visible effect
        if (size < 4){
            setTimeout(() => {
                sqaure.classList.add('show')
            }, i *100);
        } else {
            setTimeout(() => {
                sqaure.classList.add('show')
            }, i *50);
        }
        
    }
    
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

// livesTitle.style.display = 'none';
// livesNumber.style.display = 'none';
// resetBtn.style.display = 'none';
// nextLvlBtn.style.display = 'none';
// roundsText.style.display = 'none';

function game(level, size) {
    generateGrid(size); // change/reset level and lives in other functions (Reset and next)

    // Select divs after created
    colourSqs = document.querySelectorAll('.grid-item');

    // generate colour array and grab chosen colour
    let chosenColorArray = makeBaseColor();
    let chosenColor = chosenColorArray[chosenColorArray.length - 1];

    for(i = 0; i < colourSqs.length; i++){
        colourSqs[i].style.backgroundColor = chosenColor;
        // colourSqs[i].style.borderColor = 'black';
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
        // document.body.appendChild(addLife);
        document.body.querySelector('#rounds').insertAdjacentElement('afterend', addLife);
        livesNumber.innerHTML = lives;
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
                randomSqaure.style.border = 'orange 3px solid';
                nextLvlBtn.style.display = 'block';
                // resetBtn.disabled = true;
            } else {
                lives--;
                livesNumber.innerHTML = `${lives}`;
                if (lives === 0) {
                    // resetBtn.disabled = false;
                    resetBtn.classList.toggle('disabledbutton');
                    disableSquares = true;
                    gameOver = true;
                    document.querySelector('h2').innerHTML = 'Game over!';
                    randomSqaure.style.border = 'orange 3px solid';
                    // resetBtn.style.display = 'block';
                }
            }
        });
    });
}

// EVENT LISTENERS

document.addEventListener('DOMContentLoaded', function (){
    livesTitle.style.display = 'none';
    livesNumber.style.display = 'none';
    resetBtn.style.display = 'none';
    nextLvlBtn.style.display = 'none';
    roundsText.style.display = 'none';
})

startBtn.addEventListener('click', function (){
    startBtn.style.display = 'none';
    startScreen.style.display = 'none';
    mainGame.style.display = 'block';
    
    resetBtn.style.display = 'block';
    resetBtn.disabled = true;
    livesTitle.style.display = 'inline-block';
    livesNumber.style.display = 'inline-block';
    roundsText.style.display = 'block';
    roundsNumber.innerHTML = `${currentLevel}`;

    game(currentLevel, gameData[currentLevel]['size']);
    grid.classList.add('')
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

    roundsNumber.innerHTML = `${currentLevel}`;

    game(currentLevel, gameData[currentLevel]['size']);
    console.log(currentLevel);
});

resetBtn.addEventListener('click', () => {
    // resetBtn.style.display = 'none';
    currentLevel = 1;
    lives = 3;

    //reset game back to level 1
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(e => e.remove());
    document.querySelector('h2').innerHTML = '';
    disableSquares = false;
    // resetBtn.disabled = true;
    resetBtn.classList.toggle('disabledbutton');

    roundsNumber.innerHTML = `${currentLevel}`;

    game(currentLevel, gameData[currentLevel]['size']);
});


