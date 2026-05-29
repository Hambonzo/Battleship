
import { executeComputerTurn, occupiedCellClicked, randomDirection, createFleet, processShipPlacement, setCurrentShip, setShipsArr, getCurrentShip, setPlacedShips, getPlacedShips, setGameOverToFalse, getGameOver, checkComputerWinStatus, calculateShipRotation, removeShip, removeAllShips } from "../src/GameController";

describe("executeComputerTurn", () => {
    test("should correctly detect when the computer computer wins", () => {

        const mockPlayer = {
            board: {
                receiveAttack: () => true,
                allShipsSunk: () => true
            }
        };

        const result = executeComputerTurn(mockPlayer);

        expect(result.isGameOver).toBe(true);
        expect(result.row).toBeGreaterThanOrEqual(0);
        expect(result.row).toBeLessThan(10);
    });

    test("Should detect when the game is not over", () => {
        const mockPlayer = {
            board: {
                receiveAttack: () => true,
                allShipsSunk: () => false
            }
        };

        const result = executeComputerTurn(mockPlayer);

        expect(result.isGameOver).toBe(false);
        expect(result.row).toBeGreaterThanOrEqual(0);
        expect(result.row).toBeLessThan(10);
    });

    test("Should keep generating coordinates until a valid move is found", () => {
        const mockReceiveAttack = jest.fn()
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);

        const mockPlayer = {
            board: {
                receiveAttack: mockReceiveAttack,
                allShipsSunk: () => false
            }
        };

        const result = (executeComputerTurn(mockPlayer))

        expect(mockReceiveAttack).toHaveBeenCalledTimes(2);

        expect(result.isGameOver).toBe(false);
        expect(result.row).toBeGreaterThanOrEqual(0);
        expect(result.row).toBeLessThan(10);
    })

    test("should always have coordinates between 0-9 boundaries", () => {
        const mockPlayer = {
            board: {
                receiveAttack: () => true,
                allShipsSunk: () => false
            }
        };

        const result = executeComputerTurn(mockPlayer);

        expect(result.row).toBeGreaterThanOrEqual(0);
        expect(result.row).toBeLessThan(10);
        expect(Number.isInteger(result.row)).toBe(true);


        expect(result.col).toBeGreaterThanOrEqual(0);
        expect(result.col).toBeLessThan(10);
        expect(Number.isInteger(result.col)).toBe(true);
    })

});

test("occupied cell clicked to be true if it contains a ships", () => {
    const mockBoardMap = [
        [{ name: "Carrier" }, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const mockPlayer = {
        board: {
            boardMap: mockBoardMap
        }
    };

    expect(occupiedCellClicked(0, 0, mockPlayer)).toBe(true);
});

test("if cell doesnt conatain a ship return false", () => {
    const mockBoardMap = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const mockPlayer = {
        board: {
            boardMap: mockBoardMap
        }
    };

    expect(occupiedCellClicked(0, 0, mockPlayer)).toBe(false);
});

test("random direction will only be horizontal or vertical nothing else", () => {
    const validDirections = ["vertical", "horizontal"];

    for (let i = 0; i < 20; i++) {
        result = randomDirection();

        expect(validDirections).toContain(result);
    }
});

test("Creates a flee 5 elements long with lengths of 5, 4 ,3, 3, 2", () => {
    const fleet = createFleet();

    expect(fleet.length).toBe(5);

    expect(fleet[0].length).toBe(5);
    expect(fleet[1].length).toBe(4);
    expect(fleet[2].length).toBe(3);
    expect(fleet[3].length).toBe(3);
    expect(fleet[4].length).toBe(2);
});

test("when placing a ship is successful it should return saying 'placed' and increment current ship by one", () => {
    const mockPlayer = {
        board: {
            placeShip: () => true,
            boardMap: [[null, null], [null, null]]
        }
    };

    setCurrentShip(0);
    setShipsArr([
        { length: 2 },
        { length: 3 }
    ]);

    const result = processShipPlacement(0, 0, mockPlayer);

    expect(result.action).toBe("placed");
    expect(getCurrentShip()).toBe(1);
});

test("when clicking an occupied cell should return 'rotate' and not increment currentSHip", () => {

    const fakeShip = { length: 3 };

    const mockPlayer = {
        board: {
            boardMap: [
                [fakeShip, null],
                [null, null]
            ]
        }
    };

    setPlacedShips([{
        ship: fakeShip,
        x: 0,
        y: 0,
        direction: "horizontal"
    }
    ]);

    const result = processShipPlacement(0, 0, mockPlayer);

    expect(result.action).toBe("rotate");
    expect(result.clickedShip).toBe(fakeShip);

});

test("return fleetComplete when final ship in fleet is placed", () => {
    const mockPlayer = {
        board: {
            placeShip: () => true,
            boardMap: [[null, null], [null, null]]
        }
    };

    setShipsArr([{ length: 2 }]);

    setCurrentShip(0);

    const result = processShipPlacement(0, 0, mockPlayer);

    expect(result.action).toBe("fleetComplete");
    expect(getCurrentShip()).toBe(1);
});

test("return 'invalid' if move can't be placed", () => {
    const mockPlayer = {
        board: {
            placeShip: () => false,
            boardMap: [[null, null], [null, null]]
        }
    };

    setShipsArr([{ length: 5 }]);
    setCurrentShip(0);

    const result = processShipPlacement(0, 0, mockPlayer);

    expect(result.action).toBe("invalidMove");
    expect(getCurrentShip()).toBe(0);
});

test("should set gameOver to true and return 'computerWon' when turnResult is game over", () => {
    setGameOverToFalse();
    const turnResult = { isGameOver: true };

    const action = checkComputerWinStatus(turnResult);

    expect(action).toBe("computerWon");
    expect(getGameOver()).toBe(true);
});

test("should set gameOver to false and return 'gameContinues' when game is ongoing", () => {
    setGameOverToFalse();
    const turnResult = { isGameOver: false };

    const action = checkComputerWinStatus(turnResult);

    expect(action).toBe("gameContinues");
    expect(getGameOver()).toBe(false);
});

test("if rotation is blocked should revert to original direction", () => {
    const fakeShip = { length: 3 };

    const mockPlayer = {
        board: {
            placeShip: jest.fn().mockReturnValue(false),
            boardMap: [[null, null], [null, null]]
        }
    };

    const shipData = { ship: fakeShip, x: 0, y: 0, direction: "horizontal" };

    const result = calculateShipRotation(shipData, fakeShip, mockPlayer);

    expect(result.success).toBe(false);
    expect(shipData.direction).toBe("horizontal");

    expect(mockPlayer.board.placeShip).toHaveBeenCalledWith(0, 0, "horizontal", fakeShip);
})

test("if rotation is successful should apply a new direction", () => {
    const fakeShip = { length: 3 };

    const mockPlayer = {
        board: {
            placeShip: jest.fn().mockReturnValue(true),
            boardMap: [[null, null], [null, null]]
        }
    };

    const shipData = { ship: fakeShip, x: 0, y: 0, direction: "horizontal" };

    const result = calculateShipRotation(shipData, fakeShip, mockPlayer);

    expect(result.success).toBe(true);
    expect(shipData.direction).toBe("vertical");

    expect(mockPlayer.board.placeShip).toHaveBeenCalledWith(0, 0, "vertical", fakeShip);
});

test("expect coordinate where ship used to be to be null", () => {
    const carrierInstance = { name: "Carrier" };
    const SubmarineInstance = { name: "Submarine" };

    const mockPlayer = {
        board: {
            boardMap: [
                [carrierInstance, carrierInstance],
                [SubmarineInstance, null]
            ]
        }
    };

    removeShip(carrierInstance, mockPlayer);

    expect(mockPlayer.board.boardMap[0][0]).toBe(null);
    expect(mockPlayer.board.boardMap[0][1]).toBe(null);
    expect(mockPlayer.board.boardMap[1][0]).toBe(SubmarineInstance);

});

test("expect all coordinates on both boards to be null", () => {
    const carrierInstance = { name: "Carrier" };
    const submarineInstance = { name: "Submarine" };

    const mockPlayer = {
        board: {
            boardMap: [
                [carrierInstance, carrierInstance],
                [submarineInstance, null]
            ]
        }
    };

    const compCarrierInstance = { name: "Carrier" };
    const compSubmarineInstance = { name: "Submarine" };

    const mockCompPlayer = {
        board: {
            boardMap: [
                [compCarrierInstance, compCarrierInstance],
                [compSubmarineInstance, null]
            ]
        }
    };

    removeAllShips(mockPlayer, mockCompPlayer);

    expect(mockPlayer.board.boardMap[0][0]).toBe(null);
    expect(mockPlayer.board.boardMap[0][1]).toBe(null);
    expect(mockPlayer.board.boardMap[1][0]).toBe(null);
    expect(mockPlayer.board.boardMap[1][1]).toBe(null);

    expect(mockCompPlayer.board.boardMap[0][0]).toBe(null);
    expect(mockCompPlayer.board.boardMap[0][1]).toBe(null);
    expect(mockCompPlayer.board.boardMap[1][0]).toBe(null);
    expect(mockCompPlayer.board.boardMap[1][1]).toBe(null);


})




