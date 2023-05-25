/**

*/

Game.CoinAnimimation = class {
    constructor(world, x, y) {
        this.World = world;
        this.Life = 10;
        this.Image = Game.Resources.Images["map"];
        this.PicWidth = this.PicHeight = 16;
        this.X = x * 16;
        this.Y = y * 16 - 16;
        this.Xa = 0;
        this.Ya = -6;
        this.XPic = 0;
        this.YPic = 2;
    }
    Move() {
        var x = 0, y = 0;
        if (this.Life-- < 0) {
            this.World.RemoveSprite(this);
            for (x = 0; x < 2; x++) {
                for (y = 0; y < 2; y++) {
                    this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + x * 8 + Math.random() * 8) | 0, (this.Y + y * 8 + Math.random() * 8) | 0, 0, 0, 0, 2, 5));
                }
            }
        }

        this.XPic = this.Life & 3;
        this.X += this.Xa;
        this.Y += this.Ya;
        this.Ya += 1;
    }
};

Game.CoinAnimimation.prototype = new Game.NotchSprite();

Game.FlowerEnemy = class {
    constructor(world, x, y) {
        this.Image = Enjine.Resources.Images["enemies"];
        this.World = world;
        this.X = x;
        this.Y = y;
        this.Facing = 1;
        this.Type = Mario.Enemy.Spiky;
        this.Winged = false;
        this.NoFireballDeath = false;
        this.XPic = 0;
        this.YPic = 6;
        this.YPicO = 24;
        this.Height = 12;
        this.Width = 2;
        this.YStart = y;
        this.Ya = -8;
        this.Y -= 1;
        this.Layer = 0;
        this.JumpTime = 0;
        this.Tick = 0;

        var i = 0;
        for (i = 0; i < 4; i++) {
            this.Move();
        }
    }
    Move() {
        var i = 0, xd = 0;
        if (this.DeadTime > 0) {
            this.DeadTime--;

            if (this.DeadTime === 0) {
                this.DeadTime = 1;
                for (i = 0; i < 8; i++) {
                    this.World.AddSprite(new Mario.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
                }
                this.World.RemoveSprite(this);
            }

            this.X += this.Xa;
            this.Y += this.Ya;
            this.Ya *= 0.95;
            this.Ya += 1;

            return;
        }

        this.Tick++;

        if (this.Y >= this.YStart) {
            this.YStart = this.Y;
            xd = Math.abs(Mario.Character.X - this.X) | 0;
            this.JumpTime++;
            if (this.JumpTime > 40 && xd > 24) {
                this.Ya = -8;
            } else {
                this.Ya = 0;
            }
        } else {
            this.JumpTime = 0;
        }

        this.Y += this.Ya;
        this.Ya *= 0.9;
        this.Ya += 0.1;

        this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
    }
};

Game.FlowerEnemy.prototype = new Game.Enemy();

Game.Particle = class {
	constructor(world, x, y, xa, ya, xPic, yPic) {
		this.World = world;
		this.X = x;
		this.Y = y;
		this.Xa = xa;
		this.Ya = ya;
		this.XPic = (Math.random() * 2) | 0;
		this.YPic = 0;
		this.XPicO = 4;
		this.YPicO = 4;

		this.PicWidth = 8;
		this.PicHeight = 8;
		this.Life = 10;

		this.Image = Enjine.Resources.Images["particles"];
	}
	Move() {
		if (this.Life - this.Delta < 0) {
			this.World.RemoveSprite(this);
		}
		this.Life -= this.Delta;

		this.X += this.Xa;
		this.Y += this.Ya;
		this.Ya *= 0.95;
		this.Ya += 3;
	}
};

Game.Particle.prototype = new Game.NotchSprite();

Game.Sparkle = function(world, x, y, xa, ya) {
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Xa = xa;
    this.Ya = ya;
    this.XPic = (Math.random() * 2) | 0;
    this.YPic = 0;
    
    this.Life = 10 + ((Math.random() * 5) | 0);
    this.XPicStart = this.XPic;
    this.XPicO = 4;
    this.YPicO = 4;
    
    this.PicWidth = 8;
    this.PicHeight = 8;
    this.Image = Enjine.Resources.Images["particles"];
};

Game.Sparkle.prototype = new Game.NotchSprite();

Game.Sparkle.prototype.Move = function() {
    if (this.Life > 10) {
        this.XPic = 7;
    } else {
        this.XPic = (this.XPicStart + (10 - this.Life) * 0.4) | 0;
    }
    
    if (this.Life-- < 0) {
        this.World.RemoveSprite(this);
    }
    
    this.X += this.Xa;
    this.Y += this.Ya;
};



