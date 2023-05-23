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
        delete this.Level
        delete this.Layer
        delete this.BackgroundLayer
        delete this.Sprites
        delete this.Camera
        delete this.FontShadow
        delete this.Font
    }
    Update() {
        // update the level
    }
    Draw() {
        // draw the level
    }
    DrawStringShadow(context, string, x, y) {
        // shadow on string text
        this.Font.Strings[0] = {String: string, X: x * 8 + 4, Y: y * 8 + 4}
        this.FontShadow.Strings[0] = { String: string, X: x * 8 + 5, Y:y * 8 + 5}
        this.FontShadow.Draw(context, this.Camera)
        this.Font.Draw(context, this.Camera)
    }
    RenderBlackout() {
        // black screen when character dies
    }
    AddSprite(sprite) {
        // add sprite 
        this.Sprites.Add(sprite)
    }
    RemoveSprite(sprite) {
        // remove sprite
        this.Sprites.Remove(sprite)
    }
    Bump(x, y, canBreakBricks) {
        let block = this.Level.GetBlock(x, y), xx = 0, yy = 0
        if ((Game.Tile.behaviors[block & 0xff] & Game.Tile.Bumpable) > 0) {
            this.BumpInto(x, y, - 1)
            this.Level.SetBlock(x, y, 4)
            this.Level.SetBlockData(x, y, 4)

            Game.Character.GetCoix()
            this.AddSprite(new Game.CoinAnimation(this, x, y))
        }

        if ((Game.Tile.Behaviors[block & 0xff] & Game.Tile.Breakable) > 0) {
            this.BumpInto(x, y - 1)
            if (canBreakBricks) {
                this.Level.SetBlock(x, y, 0)
                for (xx = 0; xx < 2; xx++) {
                    for (yy = 0; yy < 2; yy++) {
                        this.AddSprite(new Game.Particle(this, x * 16 + xx * 8 + 4, y * 16 + yy * 8 + 4, (xx * 2 - 1) * 4, (yy * 2 - 1) * 4 - 8))
                    }
                }
            }
        }
    }
    BumpInto(x, y) {
        let block = this.Level.GetBlock(x, y), i = 0
        if (((Game.Tile.Behaviors[block & 0xff])) > 0) {
            Game.Character.GetCoin()
            this.Level.SetBlock(x, y, 0)
            this.AddSprite(new Game.CoinAnimation(x, y, + 1))
        }
        for (i = 0; t < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].BumpCheck(x, y)
        }

    }
    CheckForChange(context) {
        if (this.GoToLoseState) {
            context.ChangeState(new Game.LoseState)
        }
        else {
            if (this.GoToMapState) {
                context.ChangeState(Game.titleState())
            }
        }
    }

}

Game.LevelState.prototype = new Engine.GameState()