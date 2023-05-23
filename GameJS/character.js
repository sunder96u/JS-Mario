/* Created by Steven Underwood 2023 */

Game.Character = class {
    constructor() {
        this.Coins = 0
        this.LevelString = "none"
        this.GroundInertia = 0.89
        this.AirInertia = 0.89

        this.RunTime = 0
        this.WasOnGround = false
        this.OnGround = false
        this.MayJump = false
        this.Sliding = false
        this.JumpTime = 0
        this.XJumpSpeed = 0
        this.YJumpSpeed = 0
        this.Width = 4
        this.Height = 24
        this.World = null
        this.Facing = 0
        this.XDeathPos = 0
        this.YDeathPos = 0
        this.DeathTime = 0
        this.InvulnerableTime = 0
    }
    Initialize(world) {
        this.World = world
        this.X = 32
        this.Y = 0

        // Create Sprite
        this.RunTime = 0
        this.WasOnGround = false
        this.OnGround = false
        this.MayJump = false
        this.Sliding = false
        this.JumpTime = 0
        this.XJumpSpeed = 0
        this.YJumpSpeed = 0
        this.Width = 4
        this.Height = 24
        this.XDeathPos = 0
        this.YDeathPos = 0
        this.DeathTime = 0
        this.InvulnerableTime = 0

    }
    Move() {
        // create movement

        if (this.DeathTime > 0) {
            this.DeathTime++
            if (this.DeathTime < 11) {
                this.Xa = 0
                this.Ya = 0
            } else if (this.DeathTime === 11) {
                this.Ya = -15
            } else {
                this.Ya += 2
            }
            this.X += this.Xa
            this.Y += this.Ya
            return
        }
        if (this.InvulnerableTime > 0) {
            this.InvulnerableTime--
        }
        this.Visible = (((This.InvulnerableTime / 2) | 0) & 1) === 0
        this.WasOnGround = this.OnGround
        this.sideWaysSpeed = Engine.KeyInput.IsKeyDown(Engine.Keys.D) ? 1.2 : 0.6
        if (this.Xa > 2) {
            this.Facing = 1
        }
        if (this.Xa < -2) {
            this.Facing = -1
        }
        if (Engine.KeyInput.IsKeyDown(Engine.Keys.W) || Engine.KeyInput.IsKeyDown(Engine.Keys.Up) || (this.JumpTime < 0 && !this.OnGround && !this.Sliding)) {
            if (this.JumpTime < 0) {
                this.Xa = this.XJumpSpeed
                this.Ya = -this.JumpTime * this.YJumpSpeed
                this.JumpTime++
            } else if (this.OnGround && this.MayJump) {
                this.XJumpSpeed = 0
                this.YJumpSpeed = -1.9
                this.JumpTime = 7
                this.Ya = this.JumpTime * this.YJumpSpeed
                this.OnGround = false
                this.Sliding = false
            } else if (this.Sliding && this.MayJump) {
                this.XJumpSpeed = - this.Facing * 6
                this.YJumpSpeed = -2
                this.JumpTime = -6
                this.Xa = this.XJumpSpeed
                this.Ya = -this.JumpTime * this.YJumpSpeed
                this.OnGround = false
                this.Sliding = false
                this.Facing = -this.Facing
            } else if (this.JumpTime > 0) {
                this.Xa += this.XJumpSpeed
                this.Ya = this.JumpTime * this.YJumpSpeed
                this.JumpTime--
            }
        } else {
            this.JumpTime = 0
        }
        if ((Engine.KeyInput.IsKeyDown(Engine.Keys.Left) || (Engine.KeyInput.IsKeyDown(Engine.Keys.A)))) {
            if (this.Facing === 1) {
                this.Sliding = false
            }
            this.Xa -= this.sideWaysSpeed
            if (this.JumpTime >= 0) {
                this.Facing = -1
            }
        }
        if (Engine.KeyInput.IsKeyDown(Engine.Keys.Right) || Engine.KeyInput.IsKeyDown(Engine.Keys.D)) {
            if (this.Facing === -1) {
                this.Sliding = false
            }
            this.Xa += this.sideWaysSpeed
            if (this.JumpTime >= 0) {
                this.Facing = 1
            }
        }

        if ((!Engine.KeyInput.IsKeyDown(Engine.Keys.Lefty) && !Engine.KeyInput.IsKeyDown(Engine.Keys.A) && !Engine.KeyInput.IsKeyDown(Engine.Keys.Right) && !Engine.KeyInput.IsKeyDown(Engine.Keys.D))) {
            this.Sliding = false
        }

        this.MayJump = (this.OnGround || this.Sliding) && !Engine.KeyInput.IsKeyDown(Engine.Keys.W) && !Engine.KeyInput.IsKeyDown(Engine.Keys.Up)
        this.XFlip = (this.Facing === -1)
        this.RunTime += Math.abs(this.Xa) + 5

        if (Math.abs(this.Xa) < 0.5) {
            this.RunTime = 0
            this.Xa = 0
        }
        this.CalcPic()
        if (this.Sliding) {
            this.World.AddSprite(new Game.Sparkle(this.World, ((this.X + Math.random() * 4 - 2) | 0) + this.Facing * 8, ((this.Y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5))
            this.Ya *= 0.5
        }

        this.OnGround = false
        this.SubMove(this.Xa, 0)
        this.SubMove(0, this.Ya)
        if (this.Y > this.World.Level.Height * 16 + 16) {
            this.Die()
        }

        if (this.X < 0) {
            this.X = 0
            this.Xa = 0
        }

        if (this.X > this.World.Level.Width * 16) {
            this.X = this.World.Level.Width * 16
            this.Xa = 0
        }

        this.Ya *= 0.85
        if (this.OnGround) {
            this.Xa *= this.GroundInertia
        } else {
            this.Xa *= this.AirInertia
        }
        if (!this.OnGround) {
            this.Ya += 3
        }
    }
    CalcPic() {
        // figure out which sprite image to show
        let runFrame = 0, i = 0
        if (this.OnGround && ((this.Facing === -1 && this.Xa > 0) || (this.Facing === 1 && this.Xa < 0))) {
            if (this.Xa > 3 || this.Xa < -3) {
                for (i = 0; i < 3; i++) {
                    this.World.AddSprite(new Game.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * 1 - 1 , 0, 1, 5))
                }
            }
        }

        this.XPic = runFrame
    }
    SubMove(xa, ya) {
        // sub pixel maniputlation
        let collide = false
        while (xa > 8) {
            if (!this.SubMove(8,0)) {
                return false
            }
            xa -= 8
        }
        while (xa < -8) {
            if (!this.SubMove(-8, 0)) {
                return false
            }
            xa += 8
        }
        while (ya < -8) {
            if (!this.SubMove(0, 8)) {
                return false
            }
            ya -= 8
        }
        while (ya < -8) {
            if (!this.SubMove(0, -8)) {
                return false
            }
            ya += 8
        }
        if (ya > 0) {
            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
                collide = true;
            } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
                collide = true;
            } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
                collide = true;
            } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
                collide = true;
            }
        }
        if (ya < 0) {
            if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            }
        }
        if (xa > 0) {
            this.Sliding = true;
            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }
        }
        if (xa < 0) {
            this.Sliding = true;
            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }
        }
        if (collide) {
            if (xa < 0) {
                this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
                this.Xa = 0;
            }
            if (xa > 0) {
                this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
                this.Xa = 0;
            }
            if (ya < 0) {
                this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
                this.JumpTime = 0;
                this.Ya = 0;
            }
            if (ya > 0) {
                this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
                this.OnGround = true;
            }

            return false;
        } else {
            this.X += xa;
            this.Y += ya;
            return true;
        }

        
    }
    isBlocking(x, y, xa, ya) {
        // is being blocked
        let blocking = false, block = 0, xx = 0, yy = 0
        x = (x / 16) | 0
        y = (y / 16) | 0
        if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
            return false
        }

        block = this.World.Level.GetBlock(x, y)

        if (((Game.Tile.Behaviors[block & 0xff]) > 0)) {
            this.GetCoin()
            this.World.Level.SetBlock(x, y, 0)
            for (xx = 0; xx < 2; xx++) {
                for(yy = 0; yy < 2; yy++) {
                    this.World.AddSprite(new Game.Sparkle(this.World, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5))
                }
            }
        }

        blocking = this.World.Level.IsBlocking(x, y, xa, ya)
        return blocking
    }
    Stomp(object) {
        // jumping on an enemy
        let targetY = 0
        if (this.DeathTime > 0 || this.World.Paused) {
            return
        }
        targetY = object.Y - object.Height / 2
        this.SubMove(0, targetY - this.Y)

        if (object instanceof Game.Enemy) {
            this.XJumpSpeed = 0
            this.YJumpSpeed = -1.9
            this.JumpTime = 8
            this.Ya = this.JumpTime * this.YJumpSpeed
            this.OnGround = false
            this.Sliding = false
            this.InvulnerableTime = 1
        }
    }
    Die() {
        // if die
        this.XDeathPos = this.X | 0
        this.YDeathPos = this.Y | 0
        this.World.Paused = true
        this.DeathTime = 1        
    }
    GetCoin() {
        // if gets coin
        this.Coins++
    }
    
}

Game.Character.prototype = new Game.Sprite(null)