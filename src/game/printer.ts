import type { RenderGrid, PaddelPositionParams, PrintScreenParams } from "../types.ts"
import { GLOBALS } from "../constants/global.ts"
import { moveBall } from "./ball.ts"

export function printScreen({
    map: { mapX, mapY },
    paddelPositionP1,
    paddelPositionP2,
    ballPosition,
}: PrintScreenParams) {
    // y,x
    const mapGrid = Array.from({ length: mapY }, () => Array.from({ length: mapX }, () => " "))

    // make Grid
    for (let y = 0; y < mapY; y++) {
        for (let x = 0; x < mapX; x++) {
            const isNet = x === Math.floor(mapX / 2)
            const isBorder = y === 0 || y === mapY - 1 || x === 0 || x === mapX - 1
            const isPaddleP1 = x === 2 && y >= paddelPositionP1.topY && y <= paddelPositionP1.bottomY
            const isPaddleP2 = x === mapX - 3 && y >= paddelPositionP2.topY && y <= paddelPositionP2.bottomY

            if (isBorder) mapGrid[y][x] = "@"
            else if (isNet) mapGrid[y][x] = "|"
            else if (isPaddleP1 || isPaddleP2) mapGrid[y][x] = "#"
        }
    }

    // ball
    const newBall = moveBall({
        map: { mapX, mapY },
        paddelPositionP1,
        paddelPositionP2,
        ballPosition,
    })
    // set ball
    mapGrid[newBall.y][newBall.x] = "o"

    // render map
    renderGrid({gameGrid: mapGrid, debug: null})

    // return the ball to save the position
    return newBall
}

export function paddelPosition({
    mapY,
    move,
    actualPaddelPosition
}: PaddelPositionParams) {
    let newTopY: number = 0
    let newBottomY: number = 0

    if (move === GLOBALS.MOVE_UP) {
        // if the actual positon is already touching the top map
        if (actualPaddelPosition.topY <= 1) return actualPaddelPosition

        // minus 1 to move to the top
        newTopY = actualPaddelPosition.topY - 1
        newBottomY = actualPaddelPosition.bottomY - 1
    
    } else if (move === GLOBALS.MOVE_DOWN) {
        // if the actual position is already touching the bottom map
        if (actualPaddelPosition.bottomY >= mapY - 2) return actualPaddelPosition

        // sum 1 top move to the bottom
        newTopY = actualPaddelPosition.topY + 1
        newBottomY = actualPaddelPosition.bottomY + 1
    
    }else {
        // nothing to do
        return actualPaddelPosition
    }

    return { topY: newTopY, bottomY: newBottomY }
}

function renderGrid({
    gameGrid, 
    debug
}: RenderGrid): void {
    // cmd + k / ctrl + k
    process.stdout.write('\x1Bc');

    console.log(`P1 (up: w, down: s), P2 (up: arrow up, down: arrow down)            P1 0 / P2 0`) // TODO: points

    for (const row of gameGrid) {
        console.log(row.join(""))
    }

    if (debug) console.log(debug)
}