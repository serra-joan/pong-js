import { exit } from "node:process"
import { emitKeypressEvents } from "node:readline"
import Game from "./game/game.ts"
import type { PlayerMoves, BallPosition, PaddelPosition } from "./types.ts"
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
let gameInterval: ReturnType<typeof setInterval> | null = null
const game = new Game({
    mapGlobals: {
        x: GLOBALS.MAP_X,
        y: GLOBALS.MAP_Y,
    },
    paddels: {
        p1: PADDEL_INITIAL_POSITION, 
        p2: PADDEL_INITIAL_POSITION, 
    },
    ball: BALL_INITIAL_POSITION
})
const movesP = {
    p1: null as PlayerMoves,
    p2: null as PlayerMoves
}

// Load game
function loadGame() {
    game.constructMapGrid()

    // Start Game bucle
    gameInterval = setInterval(() => gameLoop(), GLOBALS.REFRESH_SCREEN); 
}

async function setupKeyboard() {
    emitKeypressEvents(process.stdin)

    process.stdin.setRawMode(true)
    process.stdin.resume()

    process.stdin.on("keypress", async (_str, key) => {
        if (key.ctrl && key.name === "c") {
            process.stdin.setRawMode(false)
            exit()
        }

        // If the game is paused, the paddels can not be moved
        if (gameInterval === null){
            if (key.name === "space") gameIntervalToggel()

        } else {
            if (key.name === "up") movesP.p2 = GLOBALS.MOVE_UP
            else if (key.name === "down") movesP.p2 = GLOBALS.MOVE_DOWN
            else if (key.name === "w") movesP.p1 = GLOBALS.MOVE_UP
            else if (key.name === "s") movesP.p1 = GLOBALS.MOVE_DOWN
            else if (key.name === "space") gameIntervalToggel() // pause
        }
    })
}

function gameIntervalToggel() {
    if (gameInterval === null) gameInterval = setInterval(() => gameLoop(), GLOBALS.REFRESH_SCREEN)
    else {
        clearInterval(gameInterval)
        gameInterval = null
    }
}

function gameLoop() {
    // control the paddels movement, if GLOBALS.HOLD_MOVES is false, the paddels will only move when a key is pressed, 
    // otherwise they will keep moving on the direction of the last key pressed, until another key is pressed
    if (movesP.p1 !== null) game.calcPaddelPosition({paddelP: "p1", move: movesP.p1})
    if (movesP.p2 !== null) game.calcPaddelPosition({paddelP: "p2", move: movesP.p2})
    if (!GLOBALS.HOLD_MOVES) {
        movesP.p1 = null
        movesP.p2 = null
    }

    game.constructMapGrid()
} 

setupKeyboard()
loadGame()


