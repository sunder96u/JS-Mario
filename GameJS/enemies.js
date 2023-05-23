/* Created by Steven Underwood 2023 */

Game.Enemy = class {
    constructor() {

    }
    CollisionCheck() {
        // check if hit character or wall
    }
    Move() {
        // automatically move
    }
    SubMove() {
        // subpixel movement
    }
    IsBlocking() {
        // is blocking
    }
    BumpCheck () {
        // check for bump
    }
    Draw(context, camera) {
        // draw enemy


        this.SubDraw(context, camera)
    }

}