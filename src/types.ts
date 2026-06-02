import { GLOBALS } from "./constants/global.ts"

export type PlayerMoves =
    | null
    | typeof GLOBALS.MOVE_UP
    | typeof GLOBALS.MOVE_DOWN
export type PaddelPosition = {
    topY: number,
    bottomY: number
}
export type BallPosition = {
    x: number
    y: number
    direction: {
        x: 1 | -1 | 0 // left -> -1, right -> 1, straight -> 0
        y: 1 | -1 | 0 // top -> 1, bottom -> -1, straight -> 0
    }
}  