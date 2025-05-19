# Hue Knew? - an odd-one-out game
"Hue Knew?" is a odd-one-out game where the player has to choose the sqaure in a grid that has a different colour (hue) to the rest of the sqaures. 

Play the game here: https://dede95.github.io/hue-knew-game/

## Technologies 
- HTML 
- CSS & [Bootstrap](https://getbootstrap.com/)
- Vanilla Javascript 
    - [GSAP](https://gsap.com/) - javascript library for animation 

## Game logic 
1. Diffuculty (level) and dimension of the grid (size) is selected from the data and the number of lives are set
2. The grid is generated 
3. A base colour is selected for the sqaures 
4. A random sqaure is selected and the colour is adjusted by an amount (the amount varies based on difficult and size)
5. If the user selects: 
    - the correct sqaure, the move on the next round and the game goes back to 1. with the next difficulty and grid size 
    - the wrong sqaure, the lose a life. If the lose all lives, the game ends. 
6. If the user finishes all levels, the win the game. 