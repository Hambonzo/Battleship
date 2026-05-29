
import { GameBoard } from "./Gameboard.js";

export function Player() {
    const board = GameBoard();

    function attack(x, y, enemyBoard) {
        enemyBoard.receiveAttack(x, y);
    }

    function generateMove() {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        return {x, y};
    }

    return {
        board,
        attack,
        generateMove
    }
}