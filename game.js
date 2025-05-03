const grid = document.querySelector('#grid');
const startBtn = document.querySelector('#startGame');
const livesTitle = document.querySelector('#lives');
const livesNumber = document.querySelector('#lives span');

let currentLevel = 1;
let lives = 3;
let gameOver = false;
const gridnbyn = {};
let randomSqaure;
let colourSqs;

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
        sqaure.classList.add('grid-item', 'regular');
        grid.appendChild(sqaure);
    }
    grid.style.gridTemplateColumns = `repeat(${level + 1}, 100px [col-start])`;
}

const randomSelectSquare = (gridObj) => {
    let childrenSquares = gridObj.children;
    let chosenSqaure = childrenSquares[Math.floor(Math.random() * childrenSquares.length)];

    chosenSqaure.classList.toggle('regular') //switch off square for the correct sqaure
    chosenSqaure.classList.add('correct');
    return chosenSqaure 
}

const adjustColour = (colour) => {
    let adjustedColour;

    // range -4 to 4 
    let adjusters = [-10, -7, -5, 5, 7, 10];
    let adjuster = adjusters[Math.floor(Math.random() * adjusters.length)]; 

    // grab only the rgb values from the original base colour
    let colour_vals = colour.slice(0,3);
    colour_vals[Math.floor(Math.random() * colour_vals.length)] += adjuster;
    console.log(colour);
    console.log(colour_vals);

    adjustedColour = `rgb(${colour_vals[0]}, ${colour_vals[1]}, ${colour_vals[2]})`;

    return adjustedColour

}

// function gamePlay() {

// }

// LANDING PAGE VIEW - maybe put in start button event 
// livesTitle.style.display = 'none'
generateGrid(currentLevel);

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

livesTitle.style.display = 'inline-block'
livesNumber.innerHTML = `${lives}`;

// EVENT LISTENERS

// grab squares with class .regular after they have been generated
const wrongSqs = document.querySelectorAll('.regular');
for(let wrong of wrongSqs) {
    wrong.addEventListener('click', () => {
        lives--;
        livesNumber.innerHTML = `${lives}`;
    })
}

// startBtn.addEventListener('click', function () {
//     this.style.display = 'none';
//     // randomSqaure.addEventListener('click', function(e){
//     //     e.stopPropagation();
//     //     console.log(this.style.backgroundColor);
//     // })
    
// });

// checking if vars defined in startbtn event lsitener otherwise, make global!
// MAKING randomSqaure AND colourSqs GLOBAL 

console.log(colourSqs);



