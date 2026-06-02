
export const GLOBALS = {
    REFRESH_SCREEN: 50 as number, // interval refresh screen (miliseconds)
    HOLD_MOVES: false as boolean, // if true, the paddels will keep moving on the direction of the last key pressed, until another key is pressed
    MOVE_UP: 'up' as const,
    MOVE_DOWN: 'down' as const,
    MAP_X: 111 as number, // px of the window
    MAP_Y: 30 as number, // px of the window
    PADDLE_HEIGHT: 5 as number // height of the paddel in px
} as const
        