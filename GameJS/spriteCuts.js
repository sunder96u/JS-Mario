/* Created by Steven Underwood 2023 */

Game.SpriteCuts = {
    //Fonts
    CreateBlackFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(0))
    },
    CreateRedFont: function () {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(8))
    },
    CreateGreenFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(16))
    },
    CreateBlueFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(24))
    },
    CreateYellowFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(32))
    },
    CreatePinkFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(40))
    },
    CreateCyanFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(48))
    },
    CreateWhiteFont: function() {
        return new Engine.SpriteFont([], Engine.Resources.Images["font"], 8, 8, this.GetCharArray(56))
    },
    GetCharArray: function(y) {
        let letters = []
        let i = 0
        for (i = 32; i < 127; i++) {
            letters[i] = { X: (i - 32) * 8, Y: y}
        }
        return letters
    },
    //SpriteSheets
    GetBackgroundSheet: function() {
        let sheet = []
        let x = 0, y = 0, width = Engine.Resources.Images["background"].width / 16, height = Engine.Resources.Images["background"].height / 16
        
        for (x = 0; x < width; x++) {
            sheet[x] = []

            for (y = 0; y < height; y++) {
                sheet[x][y] = { X: x * 32, Y: y * 32, Width: 32, Height: 32}
            }
        }
        return sheet
    },
    //LevelSheets
    GetLevelSheet: function() {
        let sheet = []
        let x = 0, y = 0, width = Engine.Resources.Images["map"].width / 16, height = Engine.Resources.Images["map"].height / 16

        for (x = 0; x < width; x++) {
            sheet[x] = []

            for (y = 0; y < height; y++) {
                sheet[x][y] = { X: x * 16, Y: y * 16, Width: 16, Height: 16}
            }
        }
        return sheet
    }
}

Game.SpriteTemplate = class {
    constructor(type, winged) {
        this.Type = type
        this.Winged = winged
        this.LastVisibleTick = -1
        this.IsDead = false
        this.Sprite = null

    }
    Spawn(world, x, y, direction) {
        if (this.isDead) {
            return
        }
        this.Sprite = new Game.Enemy(world, x * 16 + 8, y * 16 + 15, direction, this.Type, this.Winged)
        
        this.Sprite.SpriteTemplate = this
        world.AddSprite(this.Sprite)
    }
}






