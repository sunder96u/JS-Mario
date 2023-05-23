/* Created by Steven Underwood 2023 */

Game.Character = class {
    constructor() {
        this.World = null
        this.Facing = 0
        this.XDeath = 0
        this.YDeath = 0
    }
    Initialize(world) {
        this.World = world
        this.X = 32
        this.Y = 0

        // Create Sprite


        // Level


    }
    Move() {
        // create movement
    }
    CalculatePicture() {
        // figure out which sprite image to show
    }
    SubMove() {
        // sub pixel maniputlation
    }
    isBlocking() {
        // is being blocked
    }
    Stomp() {
        // jumping on an enemy
    }
    GetHurt() {
        // if get hurt
    }
    Die() {
        // if die
    }
    
}