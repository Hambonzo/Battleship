import { GameBoard } from "../src/Gameboard.js";
import { Ship } from "../src/Ship.js";

test("If x or y is greater than 9 return false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(11, 4, "horizontal", destroyer.length)).toBe(false);
})

test("If x or y is less than 0 return false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(6, -2, "horizontal", destroyer.length)).toBe(false);
})

test("If direction is vertical and where we want to place the ship is valid return true", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(3, 5, "vertical", destroyer.length)).toBe(true);
})

test("If direction is horizontal and where we want to place the ship is valid return true", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(3, 5, "horizontal", destroyer.length)).toBe(true);
})

test("If we are placing the ship out of bounds in the vertical direction return false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(8, 3, "vertical", destroyer.length)).toBe(false);
})

test("If we are placing the ship out of bounds in the horizontal direction return false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(3, 8, "horizontal", destroyer.length)).toBe(false);
})

test("If direction is not valid (horizontal/vertical) return false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);

    expect(game.isPlacementValid(8, 6, "up", destroyer.length)).toBe(false);
})

test("If we try and palce our ship on a coordinate with another ship it returns false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);
    game.placeShip(3, 4, "vertical", destroyer);

    let carrier = Ship(5);

    expect(game.isPlacementValid(4, 3, "horizontal", carrier.length)).toBe(false);
})

test("If placement is invalid return false", () => {
    let game = GameBoard()
    let destroyer = Ship(4);


    expect(game.placeShip(8, 4, "vertical", destroyer)).toBe(false);
})

test("If placement is valid we return true after placing ship", () => {
    let game = GameBoard()
    let destroyer = Ship(4);


    expect(game.placeShip(3, 4, "vertical", destroyer)).toBe(true);
})

test("Check if ship is placed and in correct coordinates", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    let board = game.boardMap;
    game.placeShip(3, 4, "vertical", destroyer);

    let shipCoordinates = [board[3][4], board[4][4], board[5][4], board[6][4]];

    shipCoordinates.forEach(coordinate => {
        expect(coordinate).toBe(destroyer);
    })

});

test("Check if after placement coordinates that don't have a ship remain null", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    let board = game.boardMap;
    game.placeShip(3, 4, "vertical", destroyer);

    let nullCordinates = [board[2][1], board[1][3], board[8][8]]

    nullCordinates.forEach(nullCordinate => {
        expect(nullCordinate).toBe(null);
    })
})

test("Check if x, y are not valid coordinates we return false", () => {
    let game = GameBoard();

    expect(game.receiveAttack(-1, 8)).toBe(false);
})

test("If this coordinate has already been attacked return false", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    game.placeShip(3, 4, "vertical", destroyer);
    game.receiveAttack(3, 4);

    expect(game.receiveAttack(3, 4)).toBe(false);
})

test("If we attack a ship we will set the coordinate to hit", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    let attacks = game.attacks;
    game.placeShip(3, 4, "vertical", destroyer);
    game.receiveAttack(3, 4);

    expect(attacks.get("3,4")).toBe("hit");
})

test("If we attack the ocean coordinate it will be stored as miss", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    let attacks = game.attacks;
    game.placeShip(3, 4, "vertical", destroyer);
    game.receiveAttack(2, 1);

    expect(attacks.get("2,1")).toBe("miss");
})

test("If all ships on board are sunk return true", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    game.placeShip(3, 4, "vertical", destroyer);
    game.receiveAttack(3, 4);
    game.receiveAttack(4, 4);
    game.receiveAttack(5, 4);
    game.receiveAttack(6, 4);
    
    expect(game.allShipsSunk()).toBe(true);
})

test("If all ships on board are not sunk return false", () => {
    let game = GameBoard();
    let destroyer = Ship(4);
    let paddleBoat = Ship(2);
    game.placeShip(3, 4, "vertical", destroyer);
    game.placeShip(2, 1, "vertical", paddleBoat);

    game.receiveAttack(3, 4);
    game.receiveAttack(4, 4);
    game.receiveAttack(5, 4);
    game.receiveAttack(6, 4);

    game.receiveAttack(2,1);

    expect(game.allShipsSunk()).toBe(false);
})