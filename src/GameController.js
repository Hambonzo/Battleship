import { Ship } from "./Ship.js";
import { GameBoard } from "./Gameboard.js";
import { Player } from "./Player.js";
import { displayShips, renderCells, renderHits, resetBoards, showStartButton, hideStartButton, computerVictoryText, humanVictoryText, cantHitTwiceText, yourTurnText, placeShipsText } from "./DomManager.js";

const humanPlayer = Player();
const computerPlayer = Player();

let shipsArr = [];
let placedShips = [];
let currentShip = 0;
let gameStarted = false;
let gameOver = false;

export function GameController() {
    const playerBoard = document.querySelector(".playerBoard");
    const computer = document.querySelector(".computerBoard");

    placeShipsText();

    shipsArr = createFleet();
    placedShips = [];

    renderCells(playerBoard);
    displayShips(playerBoard, humanPlayer);

    renderCells(computer);

    hideStartButton();

    placeShip();
    placeComputerShips();
    addEventListenerToBoard();

    startButton();
    resetButton();
}

function startButton() {
    const start = document.querySelector(".play");

    start.addEventListener("click", () => {
        gameStarted = true;
        gameOver = false;

        hideStartButton();
        yourTurnText();
    });
}

function resetButton() {
    const reset = document.querySelector(".reset");

    reset.addEventListener("click", () => {

        removeAllShips(humanPlayer, computerPlayer);
        resetAttacks();
        resetBoards();

        humanPlayer.board.shipsList.length = 0;
        computerPlayer.board.shipsList.length = 0;


        shipsArr = createFleet();
        placedShips = [];
        currentShip = 0;

        gameStarted = false;
        gameOver = true;

        placeComputerShips();
        placeShipsText();
    });
}


function addEventListenerToBoard() {
    const computer = document.querySelector(".computerBoard");

    computer.addEventListener("click", (event) => {
        if (gameOver) return;

        const clickedCell = event.target;

        if (!clickedCell.classList.contains("cell")) {
            return;
        }

        const row = clickedCell.dataset.row;
        const col = clickedCell.dataset.col;

        if (validateAttack(row, col, computerPlayer)) {
            renderHits(row, col, clickedCell, computerPlayer);
            if (computerPlayer.board.allShipsSunk()) {
                gameOver = true;
                humanVictoryText();
            } else {
                computerTurn();
            }
        } else {
            cantHitTwiceText();
        }

    });
}

export function validateAttack(x, y, player) {
    return player.board.receiveAttack(x, y);
}

export function executeComputerTurn(humanPlayer) {
    let validMove = false;
    let randomRow, randomCol;

    while (!validMove) {
        randomRow = Math.floor(Math.random() * 10);
        randomCol = Math.floor(Math.random() * 10);
        validMove = humanPlayer.board.receiveAttack(randomRow, randomCol);
    }

    const isGameOver = humanPlayer.board.allShipsSunk();

    return {
        row: randomRow,
        col: randomCol,
        isGameOver: isGameOver
    };
}

export function checkComputerWinStatus(turnResult) {
    if (turnResult.isGameOver) {
        gameOver = true;
        return "computerWon";
    }
    return "gameContinues";
}


function computerTurn() {
    const playerBoard = document.querySelector(".playerBoard");
    const turnResult = executeComputerTurn(humanPlayer);

    const cell = playerBoard.querySelector(`[data-row="${turnResult.row}"][data-col="${turnResult.col}"]`);
    renderHits(turnResult.row, turnResult.col, cell, humanPlayer);

    const action = checkComputerWinStatus(turnResult);

    if (action === "computerWon") {
        showStartButton();
        computerVictoryText();
    } else {
        yourTurnText();
    }
}

function resetAttacks() {
    humanPlayer.board.attacks.clear();
    computerPlayer.board.attacks.clear();
}

export function processShipPlacement(row, col, player) {
    if (occupiedCellClicked(row, col, player)) {
        const clickedShip = player.board.boardMap[row][col];
        const shipData = placedShips.find(shipObject =>
            shipObject.ship === clickedShip);

        return { action: "rotate", shipData, clickedShip };
    }

    if (currentShip >= shipsArr.length) {
        return { action: "none" };
    }

    const ship = shipsArr[currentShip];
    if (player.board.placeShip(row, col, "horizontal", ship)) {
        handlePlacement(row, col, ship);
        currentShip++;

        if (currentShip >= shipsArr.length) {
            return { action: "fleetComplete" }
        }
        return { action: "placed" };
    }

    return { action: "invalidMove" };
}


function placeShip() {
    const playerBoard = document.querySelector(".playerBoard");

    playerBoard.addEventListener("click", (event) => {
        const clickedCell = event.target;

        if (!clickedCell.classList.contains("cell") || gameStarted) {
            return;
        }

        const row = Number(clickedCell.dataset.row);
        const col = Number(clickedCell.dataset.col);

        const result = processShipPlacement(row, col, humanPlayer);

        if (result.action === 'placed' ||
            result.action === 'fleetComplete'
        ) {
            displayShips(playerBoard, humanPlayer);
        }

        if (result.action === "rotate") {
            rotation(result.shipData, result.clickedShip);

        } else if (result.action === "fleetComplete") {
            showStartButton();
        }
    });
}

export function occupiedCellClicked(x, y, player) {
    if (player.board.boardMap[x][y] !== null) {
        return true;
    }
    return false;
}

export function calculateShipRotation(shipData, clickedShip, player) {
    removeShip(clickedShip, player);
    const newDirection = shipData.direction === "horizontal" ? "vertical" : "horizontal";

    if (player.board.placeShip(shipData.x, shipData.y, newDirection, shipData.ship)) {
        shipData.direction = newDirection;
        return {direction: newDirection, success: true }
    } else {
        player.board.placeShip(shipData.x, shipData.y, shipData.direction, shipData.ship);
        return { success: false }
    }


}

function rotation(shipData, clickedShip) {
    const playerBoard = document.querySelector(".playerBoard");

    calculateShipRotation(shipData, clickedShip, humanPlayer);

    displayShips(playerBoard, humanPlayer);
}

function handlePlacement(row, col, ship) {
    let shipObject = {
        ship: ship,
        x: row,
        y: col,
        direction: "horizontal"
    }

    placedShips.push(shipObject);
}


function placeComputerShips() {
    const compShips = createFleet();

    compShips.forEach(ship => {
        randomPlacement(ship);
    });
}

function randomPlacement(ship) {
    let successfullyPlaced = false;

    while (!successfullyPlaced) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const direction = randomDirection();


        successfullyPlaced = computerPlayer.board.placeShip(row, col, direction, ship);
    }
}

export function randomDirection() {
    const directions = ["horizontal", "vertical"];

    const chosenDirection = directions[Math.floor(Math.random() * 2)];

    return chosenDirection;
}

export function removeShip(ship, human) {
    for (let r = 0; r < human.board.boardMap.length; r++) {
        for (let c = 0; c < human.board.boardMap.length; c++) {
            if (human.board.boardMap[r][c] === ship) {
                human.board.boardMap[r][c] = null;
            }
        }
    }
}

export function removeAllShips(human, comp) {
    for (let r = 0; r < human.board.boardMap.length; r++) {
        for (let c = 0; c < human.board.boardMap.length; c++) {
            human.board.boardMap[r][c] = null;
            comp.board.boardMap[r][c] = null;
        }
    }
}

export function createFleet() {
    const Carrier = Ship(5);
    const Battleship = Ship(4)
    const Cruiser = Ship(3);
    const Submarine = Ship(3);
    const Destroyer = Ship(2);

    const fleet = [Carrier, Battleship, Cruiser, Submarine, Destroyer];

    return fleet;
}

//test helpers

export function setCurrentShip(value) {
    currentShip = value;
}

export function getCurrentShip() {
    return currentShip;
}

export function setShipsArr(arr) {
    shipsArr = arr;
}

export function setPlacedShips(arr) {
    placedShips = arr;
}

export function getPlacedShips() {
    return placedShips;
}

export function setGameOverToFalse() {
    gameOver = false;
}

export function getGameOver() {
    return gameOver;
}







