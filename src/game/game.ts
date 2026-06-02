import type { PaddelPosition, BallPosition, PlayerMoves } from "../types.ts"
import { GLOBALS } from "../constants/global.ts"
import { moveBall } from "./ball.ts"

type GameGrid = Map<string,string>
interface GameConstructor {
    mapGlobals: {
        x: number
        y: number
    }
    paddels: {
        p1: PaddelPosition
        p2: PaddelPosition
    }
    ball: BallPosition
}
interface RenderGrid {
    gameGrid: GameGrid
    debug: string|null
}
interface CalcPaddelPosition {
    move: PlayerMoves
    paddelP: "p1" | "p2"
}
interface ConstructMapGrid {
    map: {
        mapX: number
        mapY: number
    }
    paddelPositionP1: PaddelPosition
    paddelPositionP2: PaddelPosition
    ballPosition: BallPosition
}

class Game implements GameConstructor {
    mapGlobals: { x: number; y: number }
    paddels: { p1: PaddelPosition; p2: PaddelPosition }
    ball: BallPosition

    constructor({
        mapGlobals: { x, y }, 
        paddels: { p1, p2 },
        ball
    }: GameConstructor) {
        this.mapGlobals = { x, y }
        this.paddels = { p1, p2 }
        this.ball = ball
    }
    
    // Render the map grid
    constructMapGrid() {
        // make Grid (y,x)
        const mapGrid: GameGrid = new Map()

        for (let y = 0; y < this.mapGlobals.y; y++) {
            const isYBorder = y === 0 || y === this.mapGlobals.y - 1
            const isOnYPpaddelPositionP1 = y >= this.paddels.p1.topY && y <= this.paddels.p1.bottomY
            const isOnYPpaddelPositionP2 = y >= this.paddels.p2.topY && y <= this.paddels.p2.bottomY

            for (let x = 0; x < this.mapGlobals.x; x++) {
                const isNet = x === Math.floor(this.mapGlobals.x / 2)
                const isBorder = isYBorder || x === 0 || x === this.mapGlobals.x - 1
                const isPaddleP1 = x === 2 && isOnYPpaddelPositionP1
                const isPaddleP2 = x === this.mapGlobals.x - 3 && isOnYPpaddelPositionP2

                if (isBorder) mapGrid.set(`${y},${x}`, "@")
                else if (isNet) mapGrid.set(`${y},${x}`, "|")
                else if (isPaddleP1 || isPaddleP2) mapGrid.set(`${y},${x}`, "#")
                else mapGrid.set(`${y},${x}`, " ")
            }
        }

        // ball
        this.ball = moveBall({
            mapGlobals: { mapX: this.mapGlobals.x, mapY: this.mapGlobals.y },
            paddels: this.paddels,
            ball: this.ball,
        })
        // set ball
        mapGrid.set(`${this.ball.y},${this.ball.x}`, "o")

        // render map
        this.renderGrid({gameGrid: mapGrid, debug: null})
    }

    // Calculate the new paddel position after a key press
    async calcPaddelPosition({
        move,
        paddelP
    }: CalcPaddelPosition) {
        let newTopY: number = 0
        let newBottomY: number = 0

        if (move === GLOBALS.MOVE_UP) {
            // if the actual positon is already touching the top map
            if (this.paddels[paddelP].topY <= 1) return

            // minus 1 to move to the top
            newTopY = this.paddels[paddelP].topY - 1
            newBottomY = this.paddels[paddelP].bottomY - 1
        
        } else if (move === GLOBALS.MOVE_DOWN) {
            // if the actual position is already touching the bottom map
            if (this.paddels[paddelP].bottomY >= this.mapGlobals.y - 2) return

            // sum 1 top move to the bottom
            newTopY = this.paddels[paddelP].topY + 1
            newBottomY = this.paddels[paddelP].bottomY + 1
        
        }else {
            return
        }

        // set new position
        this.paddels[paddelP] = {
            topY: newTopY,
            bottomY: newBottomY
        }
    }

    // This function print the gameGrid on the screen
    renderGrid({
        gameGrid, 
        debug
    }: RenderGrid): void {
        // cmd + k / ctrl + k
        process.stdout.write('\x1Bc');

        console.log(`P1 (up: w, down: s), P2 (up: arrow up, down: arrow down), Space to pause            P1 0 / P2 0`) // TODO: points

        for (let y = 0; y < GLOBALS.MAP_Y; y++) {
            let line = ""

            for (let x = 0; x < GLOBALS.MAP_X; x++) {
                const cell = gameGrid.get(`${y},${x}`)
                line += cell
            }

            console.log(line)
        }

        if (debug) console.log(debug)
    }
}

export default Game