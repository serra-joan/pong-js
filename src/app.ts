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
let gameInterval
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

// Load game
function loadGame() {
    game.constructMapGrid()

    // set interval
    gameInterval = setInterval(() => game.constructMapGrid(), GLOBALS.REFRESH_SCREEN)
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

        if (key.name === "up") movePaddel({ paddelP: "p2", move: GLOBALS.MOVE_UP })
        else if (key.name === "down") movePaddel({ paddelP: "p2", move: GLOBALS.MOVE_DOWN })
        else if (key.name === "w") movePaddel({ paddelP: "p1", move: GLOBALS.MOVE_UP })
        else if (key.name === "s") movePaddel({ paddelP: "p1", move: GLOBALS.MOVE_DOWN })
    })
}

async function movePaddel({
    paddelP, 
    move
}: { paddelP: "p1" | "p2", move: PlayerMoves }) {
    await game.calcPaddelPosition({move, paddelP: paddelP})
}

setupKeyboard()
loadGame()


