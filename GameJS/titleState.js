/* Created by Steven Underwood 2023 */

// Creates the title screen

Game.TitleState = class {
    constructor() {
        this.draw = null
        this.camera = null
    }
    Enter() {
        this.draw = new Engine.DrawManager()
        this.camera = new Engine.Camera()

        let background = new Image()
        background.scr="GameAssets/titlebackgroundsheet.png"

        this.drawManager.Add(background)
    }
    Exit() {
        this.drawManager.Clear()
        delete this.drawManager
        delete this.camera
    }
    Update(delta) {
        this.camera.X += delta * 25
        this.drawManager.Update(delta)
    }
    Draw(context) {
        this.drawManager.Draw(context, this.camera)
    }
    CheckForChange(context) {
        if (Engine.Keys.IsKeyDown(Engine.Keys.Space)) {
            context.ChangeState(Game.LevelState)
        }
    }
}

Game.TitleState.prototype = new Engine.GameState()

