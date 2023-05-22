/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

// setup the demo for the engine

Engine.Application = class {
    constructor() {
        this.canvas = null
        //this.timer = null
        this.stateContext = null
    }
    Update(delta) {
        this.stateContext.Update(delta)
        this.canvas.BeginDraw()
        this.stateContext.Draw(this.canvas.BackBufferContext2d)
        this.canvas.EndDraw()
    }
    Initialize(defaultState, resWidth, resHeight) {
        this.canvas = new Engine.GameCanvas()
        //this.score = new Engine.GameScore()
        Engine.KeyInput.Initialize()
        this.canvas.Initialize("canvas", resWidth, resHeight)
        //this.score.UpdateObject = this
        this.stateContext = new Engine.GameStateContext(defaultState)
        
    }
}