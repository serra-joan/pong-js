import { exit } from "node:process"
import { emitKeypressEvents } from "node:readline"
import { paddelPosition, printScreen } from "./game/printer.ts"
import type { BallPosition, PaddelPosition } from "./types.ts"
import { GLOBALS } from "./constants/global.ts"

// globals
const PADDEL_INITIAL_POSITION: PaddelPosition = {
    topY: Math.floor(GLOBALS.MAP_Y / 2) - Math.floor(GLOBALS.PADDLE_HEIGHT / 2),
    bottomY: Math.floor(GLOBALS.MAP_Y / 2) + Math.floor(GLOBALS.PADDLE_HEIGHT / 2)
}
const BALL_INITIAL_POSITION: BallPosition = {
    x: 4,
    y: Math.floor(GLOBALS.MAP_Y / 2),
    direction: { x: 1,  y: -1}
}

// game variables
let game
let ballPosition: BallPosition = BALL_INITIAL_POSITION
let actualPaddelPositionP1: PaddelPosition = PADDEL_INITIAL_POSITION
let actualPaddelPositionP2: PaddelPosition = PADDEL_INITIAL_POSITION

// Load game
function loadGame() {
    ballPosition = printScreen({
        map: {
            mapX: GLOBALS.MAP_X,
            mapY: GLOBALS.MAP_Y,
        },
        paddelPositionP1: actualPaddelPositionP1,
        paddelPositionP2: actualPaddelPositionP2,
        ballPosition
    })

    // set interval
    game = setInterval(() => ballPosition = printScreen({
        map: {
            mapX: GLOBALS.MAP_X,
            mapY: GLOBALS.MAP_Y,
        },
        paddelPositionP1: actualPaddelPositionP1,
        paddelPositionP2: actualPaddelPositionP2,
        ballPosition
    }), GLOBALS.REFRESH_SCREEN)
}

function setupKeyboard() {
    emitKeypressEvents(process.stdin)

    process.stdin.setRawMode(true)
    process.stdin.resume()

    process.stdin.on("keypress", (_str, key) => {
        if (key.ctrl && key.name === "c") {
            process.stdin.setRawMode(false)
            exit()
        }

        if (key.name === "up") actualPaddelPositionP2 = paddelPosition({ mapY: GLOBALS.MAP_Y, move: GLOBALS.MOVE_UP, actualPaddelPosition: actualPaddelPositionP2 })
        else if (key.name === "down") actualPaddelPositionP2 = paddelPosition({ mapY: GLOBALS.MAP_Y, move: GLOBALS.MOVE_DOWN, actualPaddelPosition: actualPaddelPositionP2 })
        else if (key.name === "w") actualPaddelPositionP1 = paddelPosition({ mapY: GLOBALS.MAP_Y, move: GLOBALS.MOVE_UP, actualPaddelPosition: actualPaddelPositionP1 })
        else if (key.name === "s") actualPaddelPositionP1 = paddelPosition({ mapY: GLOBALS.MAP_Y, move: GLOBALS.MOVE_DOWN, actualPaddelPosition: actualPaddelPositionP1 })
    })
}

setupKeyboard()
loadGame()


