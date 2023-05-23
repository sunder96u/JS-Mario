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

Game.Enemy.prototype = new Game.Sprite()
Game.Enemy.prototype.SubDraw = Game.Sprite().prototype.Draw

Game.Enemy.RedKoopa = 0
Game.Enemy.GreenKoopa = 1
Game.Enemy.Goomba = 2
Game.Enemy.Spiky = 3
Game.Enemy.Flower = 4