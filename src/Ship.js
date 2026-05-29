export function Ship(length) {
    let hitCount = 0;

    function hit(){
        if(hitCount < length) {
            hitCount++;
        }
    }

    function isSunk() {
        return hitCount === length;
    }

    return {
        hit,
        isSunk,
        length 
    }
}