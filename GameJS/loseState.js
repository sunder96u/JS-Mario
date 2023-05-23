/* Created by Steven Underwood 2023 */

Game.LooseState = class {
    constructor() {
        this.drawer = null
        this.camera = null
        this.gameOver = null
        this.font = null
        this.wasKeyDown = false
    }
    Enter() {
        this.drawer = new Engine.Drawer()
        this.camera = new Engine.Camera()
        this.gameOver = new Engine.AnimatedSprite()
        this.gameOver.SetColumnCount(9)
        this.gameOver.SetRowCount(1)
        this.gameOver.FramesPerSecond = 1/15
        this.gameOver.X = 112
        this.gameOver.Y = 68
        this.font = Game.SpriteCuts.CreateBlackFont()
        this.font.Strings[0] = { String: "Game Over!", X: 116, Y: 160}
        this.drawer.Add(this.font)
        this.drawer.Add(this.gameOver)
    }
    Exit() {
        this.drawer.Clear()
        delete this.drawer
        delete this.camera
        delete this.gameOver
        delete this.font
    }
    Update(delta) {
        this.drawer.Update(delta)
        if (Engine.KeyInput.IsKeyDown(Engine.Keys.Space)) {
            this.wasKeyDown = true
        }
    }
    Draw(context) {
        this.drawer.Draw(context, this.camera)
    }
    CheckForChange(context) {
        if (this.wasKeyDow && !Engine.KeyInput.IsKeyDown(Engine.Keys.Space)) {
            context.ChangeState(new Game.TitleState())
        }
    }
}