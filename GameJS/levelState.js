/* Created by Steven Underwood 2023 */

Game.LevelState = class {
    constructor(difficulty, type) {

    }
    Enter() {
    // entering the level
    }
    Exit() {
        // exiting the level (clear canvas)
    }
    Update() {
        // update the level
    }
    Draw() {
        // draw the level
    }
    DrawStringShadow() {
        // shadow on string text
    }
    RenderBlackout() {
        // black screen when character dies
    }
    AddSprite() {
        // add sprite 
    }
    RemoveSprite() {
        // remove sprite
    }
    Bump() {

    }
    BumpInto() {

    }
    CheckForChange(context) {

    }

}

Game.LevelState.prototype = new Engine.GameState()