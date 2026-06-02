import type { BallPosition, PaddelPosition } from "../types.ts"

interface CalcBallPosition {
    mapGlobals: {
        mapX: number
        mapY: number
    }
    paddels: {
        p1: PaddelPosition
        p2: PaddelPosition
    }
    ball: BallPosition
}

export function moveBall({
    mapGlobals: { mapX, mapY },
    paddels,
    ball,
}: CalcBallPosition) {
    // create new positions
    const newBall: BallPosition = {
        x: ball.x + ball.direction.x,
        y: ball.y + ball.direction.y,
        direction: {
            x: ball.direction.x,
            y: ball.direction.y
        }
    }

    // X
        // check if the ball touc the paddel
        // paddel 2
    if (newBall.x +1 === mapX - 3 && (newBall.y <= paddels.p2.bottomY && newBall.y >= paddels.p2.topY)) {
        newBall.x = newBall.x - 1
        newBall.direction.x = newBall.direction.x * -1
        
        // paddel 1
    }else if (newBall.x -1 === 2 && (newBall.y <= paddels.p1.bottomY && newBall.y >= paddels.p1.topY)) {
        newBall.x = newBall.x + 1
        newBall.direction.x = newBall.direction.x * -1

        // border left
    }else if (newBall.x <= 0) {
        newBall.x = mapX - 4
        newBall.y = Math.floor(mapY / 2)

        // border right
    }else if (newBall.x >= mapX - 1) {
        newBall.x = 4
        newBall.y = Math.floor(mapY / 2)
    }
    

    // Y
        // top
    if (newBall.y <= 1) {
        newBall.y = 1
        newBall.direction.y = 1

        // bottom
    }else if (newBall.y >= mapY - 2) {
        newBall.y = mapY - 2
        newBall.direction.y = -1
    }
    
     

    return newBall
}