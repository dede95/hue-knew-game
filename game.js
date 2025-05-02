const grid = document.querySelector('#grid');
const startBtn = document.querySelector('#startGame')

let currentLevel = 1;
let gameOver = false;
const gridnbyn = {};

const makeBaseColor = () => {
    let rVal = Math.floor(Math.random() * 255) + 1;
    let gVal = Math.floor(Math.random() * 255) + 1;
    let bVal = Math.floor(Math.random() * 255) + 1;

    return [rVal, gVal, bVal, `rgb(${rVal}, ${gVal}, ${bVal})`]
}

const randomSelectSquare = (gridObj, colourArray) => {
    let childrenSquares = gridObj.children;
    let chosenSqaure = childrenSquares[Math.floor(Math.random() * childrenSquares.length)];

    return chosenSqaure 
}

const generateGrid = (level) => {
    let sqaures = (level + 1) ** 2;
    for(let i = 0; i < sqaures; i++){
        let sqaure = document.createElement('div');
        sqaure.classList.add('grid-item');
        grid.appendChild(sqaure);
    }
    grid.style.gridTemplateColumns = `repeat(${level + 1}, 100px [col-start])`;
}
// keys = Object.keys(gridnbyn);

const adjustColour = (colour) => {
    let adjustedColour;

    // range -4 to 4 
    let adjusters = [-10, -7, -5, -4, 4, 5, 7, 10];
    let adjuster = adjusters[Math.floor(Math.random() * adjusters.length)]; 

    // grab only the rgb values from the original base colour
    let colour_vals = colour.slice(0,3);
    colour_vals[Math.floor(Math.random() * colour_vals.length)] += adjuster;
    console.log(colour);
    console.log(colour_vals);

    adjustedColour = `rgb(${colour_vals[0]}, ${colour_vals[1]}, ${colour_vals[2]})`;

    return adjustedColour

}

startBtn.addEventListener('click', function () {
    this.style.display = 'none';
    generateGrid(currentLevel);
    let colourSqs = document.querySelectorAll('.grid-item');

    // generate colour array and grab chosen colour
    let chosenColorArray = makeBaseColor();
    let chosenColor = chosenColorArray[chosenColorArray.length - 1];

    for(i = 0; i < colourSqs.length; i++){
        colourSqs[i].style.backgroundColor = chosenColor;
    }

    let randomSqaure = randomSelectSquare(grid); 
    randomSqaure.style.backgroundColor = adjustColour(chosenColorArray);
});




