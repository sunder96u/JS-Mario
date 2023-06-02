/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

// Creates the title screen

Game.TitleState = class {
    constructor(rng) {
        this.draw = null
        this.camera = null
        this.font = null
        this.Rng = rng
    }
    Enter() {
        this.drawer = new Engine.Drawer()
        this.camera = new Engine.Camera()

        let backgroundLayer0 = ""
        let backgroundLayer1 = ""
        console.log(this.Rng)
        if (this.Rng < 5) {
            console.log('should be overground')
            let  backgroundGenerator = new Game.Background(2048, 15, true, Game.LevelType.Overground)
            backgroundLayer0 = new Game.BackgroundRender(backgroundGenerator.CreateLevel(), 320, 240, 2)
            backgroundGenerator.SetValues(2048, 15, false, Game.LevelType.Overground)
            backgroundLayer1 = new Game.BackgroundRender(backgroundGenerator.CreateLevel(), 320, 240, 1)
        } else {
            console.log('should be underground')
            let backgroundGenerator = new Game.Background(2048, 15, true, Game.LevelType.Underground)
            backgroundLayer0 = new Game.BackgroundRender(backgroundGenerator.CreateLevel(), 320, 240, 2)
            backgroundGenerator.SetValues(2048, 15, false, Game.LevelType.Underground)
            backgroundLayer1 = new Game.BackgroundRender(backgroundGenerator.CreateLevel(), 320, 240, 1)
        }



        this.title = new Engine.Sprite()
        this.title.Image = Engine.Resources.Images["title"]
        this.title.X = 0, this.title.Y = 120

        this.Logo = Game.SpriteCuts.CreateRedFont()
        this.Logo.Strings[0] = { String: "Endless Mario in JavaScript", X: 50, Y: 20 }

        this.font = Game.SpriteCuts.CreatePinkFont()
        this.font.Strings[0] = { String: "Press Space to Start", X: 100, Y: 120 }

        this.Instructions = Game.SpriteCuts.CreateCyanFont()
        this.Instructions.Strings[0] = { String: "How far can you run?", X: 75, Y: 60}


        this.drawer.Add(backgroundLayer0)
        this.drawer.Add(backgroundLayer1)

        Game.GlobalMapState = new Game.LevelState()
        Game.Main = new Game.Character()
        Game.Main.Image = Engine.Resources.Images["character"]

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
            context.ChangeState(new Game.LevelState(Math.floor(Math.random() * 9), Math.floor(Math.random() * 2)))
        }
    }
}

Game.TitleState.prototype = new Engine.GameState()

