/* Created by Steven Underwood 2023 */

Game.CoinAnimation = class {
    constructor(world, x, y) {
        this.World = world
        this.Image = Engine.Resources.Images["map"]
        this.PicWidth = this.PicHeight = 16
        this.X = x * 16
        this.Y = y * 16 - 16
        this.Xa = 0
        this.Ya = -6
        this.XPic = 0
        this.YPic = 2

    }
    Move() {
        this.X += this.Xa
        this.Y += this.Ya
        this.Ya += 1
    }
}

// Game.CoinAnimation.prototype = new Game.Sprite()

Game.Particle = class {
    constructor(world, x, y, xa, ya) {
        this.World = world
        this.X = x
        this.Y = y
        this.Xa = xa
        this.Ya = ya
        this.XPic = (Math.random() * 2) | 0
        this.YPic = 0
        this.XPic0 = 4
        this.YPic0 = 4
        this.PicWidth = 8
        this.PicHeight = 8
        this.Image = Engine.Resources.Images["particles"]

    }
    Move() {
        this.X += this.Xa
        this.Y += this.Ya
        this.Ya += 0.95
        this.Ya += 3
    }
}

// Game.Particle = new Game.Sprite()

Game.Sparkle = class {
    constructor(world, x, y, xa, ya) {
        this.World = world
        this.X = x
        this.Y = y
        this.Xa = xa
        this.Ya = ya
        this.XPic = (Math.random() * 2) | 0
        this.YPic = 0
        this.XPicStaer = this.XPic
        this.XPic0 = 4
        this.YPic0 = 4
        this.PicWidth = 8
        this.PicHeight = 8
        this.Image = Engine.Resources.Images["particles"]

    }
    Move() {
        this.X += this.Xa
        this.Y += this.Ya

    }
}

// Game.Sparkle = new Game.Sprite()