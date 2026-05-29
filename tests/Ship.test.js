import { Ship } from "../src/Ship.js";

test("Ship is not sunk if it takes multiple hits but still below it's length", () => {
    const destroyer = Ship(3);

    destroyer.hit();
    destroyer.hit();

    expect(destroyer.isSunk()).toBe(false);
})

test("Ship is sunk once hits equal length", () => {
    const destroyer = Ship(3);

    destroyer.hit();
    destroyer.hit();
    destroyer.hit();

    expect(destroyer.isSunk()).toBe(true);
})

test("even aftersunk extra hits keep Ship sunk", () => {
    const destroyer = Ship(3);

    destroyer.hit();
    destroyer.hit();
    destroyer.hit();
    destroyer.hit();


    expect(destroyer.isSunk()).toBe(true);
})

test("Ship in initial state is not sunk", () => {
    const speedBoat = Ship(1);

    expect(speedBoat.isSunk()).toBe(false);
})