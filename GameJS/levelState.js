/* Created by Steven Underwood 2023 */

Game.LevelState = class {
    constructor(difficulty, type) {
        this.LevelDifficulty = difficulty
        this.LevelType = type
        this.Level = null
        this.Layer = null
        this.BackgroundLayer = []

        this.Paused = false
        this.Sprites = null
        this.SpritesToAdd = null
        this.Camera = null
        
        this.FontShadow = null
        this.Font = null

        this.TimeLeft = 0
        this.StartTime = 0
        this.Tick = 0

        this.Delta = 0

        this.GoToMapState = false
        this.GoToLoseState = false
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