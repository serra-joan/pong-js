import type { BallPosition, PrintScreenParams } from "../types.ts"

export function moveBall({
    map: { mapX, mapY },
    paddelPositionP1,
    paddelPositionP2,
    ballPosition,
}: PrintScreenParams) {
    // create new positions
    const newBall: BallPosition = {
        x: ballPosition.x + ballPosition.direction.x,
        y: ballPosition.y + ballPosition.direction.y,
        direction: {
            x: ballPosition.direction.x,
            y: ballPosition.direction.y
        }
    }

    // X
        // check if the ball touc the paddel
        // paddel 2
    if (newBall.x +1 === mapX - 3 && (newBall.y <= paddelPositionP2.bottomY && newBall.y >= paddelPositionP2.topY)) {
        newBall.x = newBall.x - 1
        newBall.direction.x = newBall.direction.x * -1
        
        // paddel 1
    }else if (newBall.x -1 === 2 && (newBall.y <= paddelPositionP1.bottomY && newBall.y >= paddelPositionP1.topY)) {
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