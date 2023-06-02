/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

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

Game.Particle.prototype = new Game.GameSprite()

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

Game.Sparkle.prototype = new Game.GameSprite()

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