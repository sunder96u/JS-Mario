/* Created by Steven Underwood 2023 */

// Creates the title screen

Game.TitleState = class {
    constructor() {
        this.draw = null
        this.camera = null
        this.font = null
    }
    Enter() {
        this.drawer = new Engine.Drawer()
        this.camera = new Engine.Camera()

        let backgroundGenerator = new Game.Background(2048, 15, true, Game.LevelType.Title)
        let backgroundLayer0 = new Game.BackgroundRender(backgroundGenerator.CreateLevel(), 320, 240, 1)
        backgroundGenerator.SetValues(2048, 15, false, Game.LevelType.Title)

        this.title = new Engine.Sprite()
        this.title.Image = Engine.Resources.Images["title"]
        this.title.X = 0, this.title.Y = 120

        this.Logo = Game.SpriteCuts.CreateRedFont()
        this.Logo.Strings[0] = { String: "Endless Mario in JavaScript", X: 50, Y: 20 }

        this.font = Game.SpriteCuts.CreateWhiteFont()
        this.font.Strings[0] = { String: "Press Space to Start", X: 96, Y: 120 }

        this.Instructions = Game.SpriteCuts.CreateYellowFont()
        this.Instructions.Strings[0] = { String: "How far can you run?", X: 50, Y: 100}

        this.drawer.Add(backgroundLayer0)

        Game.GlobalMapState = new Game.LevelState() 
        Game.Character.Image = Engine.Resources.Images["character"]
    }
    Exit() {
        this.drawer.Clear()
        delete this.drawer
        delete this.camera
        delete this.font
    }
    Update(delta) {
        this.camera.X += delta * 25
        this.drawer.Update(delta)
    }
    Draw(context) {
        this.drawer.Draw(context, this.camera)
        context.drawImage(Engine.Resources.Images['title'], 0, 120)
        this.font.Draw(context, this.camera)
        this.Logo.Draw(context, this.camera)
        this.Instructions.Draw(context, this.camera)
    }
    CheckForChange(context) {
        if (Engine.KeyInput.IsKeyDown(Engine.Keys.Space)) {
            context.ChangeState(new Game.LevelState(0, 0))
        }
    }
}

Game.TitleState.prototype = new Engine.GameState()

