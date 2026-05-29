import { Ship } from "./Ship.js";

export function GameBoard() {

    function createBoard() {
        const boardMap = [];

        for (let row = 0; row < 10; row++) {
            const currentRow = [];

            for (let col = 0; col < 10; col++) {
                currentRow.push(null);
            }

            boardMap.push(currentRow);
        }
        return boardMap
    }

    function missedAttacksBoard() {
        let missedShots = [];

        for (let row = 0; row < 10; row++) {
            const currentRow = [];

            for (let col = 0; col < 10; col++) {
                currentRow.push(null);
            }

            missedShots.push(currentRow);
        }
        return missedShots;
    }


    function placeShip(x, y, direction, ship) {

        if (!isPlacementValid(x, y, direction, ship.length)) {
            return false;
        }

        shipsList.push(ship);

        if (direction === "horizontal") {
            for (let i = 0; i < ship.length; i++) {
                boardMap[x][y + i] = ship;
            }
        }

        if (direction === "vertical") {
            for (let i = 0; i < ship.length; i++) {
                boardMap[x + i][y] = ship;
            }
        }

        return true;

    }

    function isPlacementValid(x, y, direction, shipLength) {
        if (x < 0 || x > 9 || y < 0 || y > 9) {
            return false;
        }

        if (direction !== "horizontal" && direction !== "vertical") {
            return false;
        }

        if (direction === "horizontal") {
            for (let i = 0; i < shipLength; i++) {
                if (y + i > 9 || boardMap[x][y + i] !== null) {
                    return false;
                }
            }
            return true;
        }

        if (direction === "vertical") {
            for (let i = 0; i < shipLength; i++) {
                if (x + i > 9 || boardMap[x + i][y] !== null) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    function receiveAttack(x, y) {
        if (x < 0 || y < 0 || x > 9 || y > 9) {
            return false;
        }

        let key = `${x},${y}`;

        if (attacks.has(key)) {
            return false;
        }

        const cell = boardMap[x][y];

        if (cell !== null) {
            cell.hit();
            attacks.set(key, "hit");
        } else {
            attacks.set(key, "miss");
        }
        return true;
    }

    function allShipsSunk() {
        return shipsList.every(ship => ship.isSunk());
    }

    const boardMap = createBoard();
    const attacks = new Map();
    const shipsList = [];


    return {
        boardMap,
        shipsList,
        attacks,
        isPlacementValid,
        placeShip,
        receiveAttack,
        allShipsSunk
    };

}

