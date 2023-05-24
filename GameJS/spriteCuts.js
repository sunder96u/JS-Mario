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
        if (this(isDead)) {
            return
        }

        if (this.Type === Game.Enemy.Flower) {
            this.Sprite = new Game.FlowerEnemy(world, x * 16 + 15, y * 16 + 24)
        } else {
            this.Sprite = new Game.Enemy(world, x * 16 + 8, y * 16 + 15, direction, this.Type, this.Winged)
        }
        this.Sprite.SpriteTemplate = this
        world.AddSprite(this.Sprite)
    }
}

Game.Sprite = class {
    constructor(image) {
        this.XOld = 0
        this.YOld = 0
        this.X = 0
        this.Y = 0
        this.Xa = 0
        this.Ya = 0
        this.XPic = 0
        this.YPic = 0
        this.XPic0 = 0
        this.YPic0 = 0
        this.PicWidth = 32
        this.PicHeight = 32
        this.XFlip = false
        this.YFlip = false
        this.Visible = true
        this.Image = image
        this.Delta = 0
        this.SpriteTemplate = null
        this.Layer = -1

    }
    Draw(context) {
        let xPixel = 0
        let yPixel = 0
        if (!this.Visible) { return }

        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPic0
        yPixel = ((this.YOld = (this.Y - this.YOld) * this.Delta) | 0) - this.YPic0

        context.save()
        context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
        context.translate(this.XFlipe ? -320 : 0, this.YFlip ? -240 : 0)
        context.drawImage(this.Image, this.XPic * this.PicWidth, this.YPic * this.PicHeight, this.PicWidth, this.PicHeight, this.XFlip ? (320 - xPixel - this.PicWidth) : xPixel, this.YFlip ? (240 - yPixel - this.PicHeight) : yPixel, this.PicWidth, this.PicHeight)
        context.restore()
    }
    Update(delta) {
        this.XOld = this.X
        this.YOld = this.Y
        this.Move()
        this.Delta = delta
    }
    UpdateNoMove() {
        this.XOld = this.X
        this.Yold = this.Y
        this.Delta = 0
    }
    Move() {
        this.X += this.Xa
        this.Y += this.Ya
    }
    GetX(delta) {
        return ((this.XOld + (this.X - this.XOld) * delta) | 0) - this.XPic0
    }
    GetY() {
        return ((this.YOld + (this.Y - this.YOld) * delta) | 0) - this.YPic0
    }
    CollideCheck() {}
    BumpCheck() {}
}

Game.Sprite.prototype = new Engine.Drawable()
