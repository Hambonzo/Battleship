import { Player } from "./Player.js";

export function renderCells(board) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        let row = Math.floor(i / 10);
        let col = i % 10;

        cell.dataset.row = row;
        cell.dataset.col = col;

        board.appendChild(cell);
    }
}

export function displayShips(board, player) {
    resetBoards();
    
    let allCells = board.querySelectorAll(".cell");

    allCells.forEach(cell => {
        let row = cell.dataset.row;
        let col = cell.dataset.col;

        //let key = `${row},${col}`

        if (player.board.boardMap[row][col] !== null) {
            cell.classList.add("shipCell");
        }

        if (player.board.boardMap[row][col] === null) {
            cell.classList.remove("shipCell");
        }
    });
}

export function renderHits(x, y, cell, player) {
    let key = `${x},${y}`;

    if (player.board.attacks.get(key) === "hit") {
        cell.classList.add("shipCellHit");
    }

    if (player.board.attacks.get(key) === "miss") {
        cell.classList.add("missCell");
    }
}

export function resetBoards() {
    const playerCells = document.querySelectorAll(".cell");

    playerCells.forEach(cell => {
        cell.classList.remove("shipCellHit");
        cell.classList.remove("missCell");
        cell.classList.remove("shipCell");
    });
}

export function showStartButton() {
    const start = document.querySelector(".play");
     start.style.visibility = "visible"; 
}

export function hideStartButton() {
    const start = document.querySelector(".play"); 
    start.style.visibility = "hidden";
} 

export function placeShipsText() {
    const gameState = document.querySelector(".phase");

    gameState.textContent = "Place your Ships";
}

export function yourTurnText() {
    const gameState = document.querySelector(".phase");

    gameState.textContent = "Your turn, select a cell to launch fire upon!";
}

export function cantHitTwiceText() {
    const gameState = document.querySelector(".phase");

    gameState.textContent = "You can't hit this cell again, fire upon a cell without a marker!";
}

export function humanVictoryText() {
    const gameState = document.querySelector(".phase");

    gameState.textContent = "Humans have won against machines!";
}

export function computerVictoryText() {
    const gameState = document.querySelector(".phase");

    gameState.textContent = "Machines have declared victory!";
}