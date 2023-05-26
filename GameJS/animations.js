


Game.CoinAnimation = class {
    constructor(world, x, y) {
        this.World = world
        this.Life = 10
        this.Image = Game.Resources.Images["map"]
        this.PicWidth = this.PicHeight = 16
        this.X = x * 16
        this.Y = y * 16 - 16
        this.Xa = 0
        this.Ya = -6
        this.XPic = 0
        this.YPic = 2
    }
    Move() {
        let x = 0, y = 0
        if (this.Life-- < 0) {
            this.World.RemoveSprite(this)
            for (x = 0; x < 2; x++) {
                for (y = 0; y < 2; y++) {
                    this.World.AddSprite(new Game.Sparkle(this.World, (this.X + x * 8 + Math.random() * 8) | 0, (this.Y + y * 8 + Math.random() * 8) | 0, 0, 0, 0, 2, 5))
                }
            }
        }

        this.XPic = this.Life & 3
        this.X += this.Xa
        this.Y += this.Ya
        this.Ya += 1
    }
}

Game.CoinAnimation.prototype = new Game.NotchSprite();

Game.Particle = class {
	constructor(world, x, y, xa, ya, xPic, yPic) {
		this.World = world
		this.X = x
		this.Y = y
		this.Xa = xa
		this.Ya = ya
		this.XPic = (Math.random() * 2) | 0
		this.YPic = 0
		this.XPicO = 4
		this.YPicO = 4

		this.PicWidth = 8
		this.PicHeight = 8
		this.Life = 10

		this.Image = Engine.Resources.Images["particles"]
	}
	Move() {
		if (this.Life - this.Delta < 0) {
			this.World.RemoveSprite(this)
		}
		this.Life -= this.Delta

		this.X += this.Xa
		this.Y += this.Ya
		this.Ya *= 0.95
		this.Ya += 3
	}
}

Game.Particle.prototype = new Game.NotchSprite()

Game.Sparkle = function(world, x, y, xa, ya) {
    this.World = world
    this.X = x
    this.Y = y
    this.Xa = xa
    this.Ya = ya
    this.XPic = (Math.random() * 2) | 0
    this.YPic = 0
    
    this.Life = 10 + ((Math.random() * 5) | 0)
    this.XPicStart = this.XPic
    this.XPicO = 4
    this.YPicO = 4
    
    this.PicWidth = 8
    this.PicHeight = 8
    this.Image = Engine.Resources.Images["particles"]
}

Game.Sparkle.prototype = new Game.NotchSprite()

Game.Sparkle.prototype.Move = function() {
    if (this.Life > 10) {
        this.XPic = 7
    } else {
        this.XPic = (this.XPicStart + (10 - this.Life) * 0.4) | 0
    }
    
    if (this.Life-- < 0) {
        this.World.RemoveSprite(this)
    }
    
    this.X += this.Xa
    this.Y += this.Ya
}