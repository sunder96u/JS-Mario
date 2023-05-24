/* Created by Steven Underwood 2023 */

Game.Enemy = class {
    constructor(world, x, y, dir, type, winged) {
        this.GroundInertia = 0.89
        this.AirInertia = 0.89
        this.RunTime = 0
        this.OnGround = false
        this.MayJump = false
        this.JumpTime = 0
        this.XJumpSpeed = 0
        this.YJumpSpeed = 0
        this.Width = 4
        this.Height = 24
        this.DeadTime = 0
        this.FlyDeath = false
        this.WindTime = 0
        this.X = x
        this.Y = y
        this.World = world
        this.Type = type
        this.Winged = winged
        this.Image = Engine.Resources.Images["enemies"]
        this.XPic0 = 8
        this.YPic0 = 31
        this.AvoidCliffs = this.Type === Game.Enemy.RedKoopa
        this.YPic = this.Type
        if (this.YPic > 1) {
            this.Height = 12
        }
        this.Facing = dir
        if (this.Facing === 0) {
            this.Facing = 1
        }
        this.PicWidth = 16

    }
    CollisionCheck() {
        // check if hit character or wall
        if (this.DeatTime != 0) {
            return
        }

        let xCharacterD = Game.Character.X - this.X, yCharacterD = Game.Character.Y - this.Y
        if (xCharacterD > -this.Width * 2 - 4 && xCharacterD < this.Width * 2 + 4) {
            if (yCharacterD > -this.Height && yCharacterD < Game.Character.Height) {
                if (this.Type != Game.Enemy.Spiky && Game.Character.Ya > 0 && yCharacterD <= 0 && (!Game.Character.OnGround || !Game.Character.WasOnGround)) {
                    Game.Character.Stomp(this)
                    if (this.Winged) {
                        this.Winged = false
                        this.Ya = 0
                    } else {
                        this.YPic0 = 31 - (32 - 8)
                        this.PicHeight = 8

                        if (this.SpriteTemplate != null) {
                            this.SpriteTemplate.IsDead = true
                        }
                        this.DeadTime = 10
                        this.Winged = false
                    }
                } else {
                    Game.Character.GetHurt()
                }
            }
        }
    }
    Move() {
        // automatically move
        let i = 0, sideWaysSpeed = 1.75, runFrame = 0
        this.WingTime++
        if (this.DeatTime > 0) {
            this.DeadTime--
            if (this.DeadTime === 0) {
                this.DeadTime = 1
                for (i = 0; i < 8; i++) {
                    this.World.AddSprite(new Game.Sparkle(this.World, ((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y - Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 5))
                }
                this.World.RemoveSprite(this)
            }

            if (this.FlyDeath) {
                this.X += this.Xa
                this.y += this.Ya
                this.Ya *= 0.95
                this.Ya += 1
            }
            return
        }
        if (this.Xa > 2) {
            this.Facing = 1
        }
        if (this.Xa < -2) {
            this.Facing = -1
        }

        this.Xa = this.Facing * sideWaysSpeed
        this.MayJump = this.OnGround
        this.XFlip = this.Facing === -1
        this.RunTime += Math.abs(this.Xa) + 5
        runFrame = ((this.RunTime / 20) | 0) % 2
        if (!this.OnGround) {
            runFrame = 1
        }
        if (!this.SubMove(this.Xa, 0)) {
            this.Facing = -this.Facing
        }
        this.OnGround = false
        this.SubMove(0, this.Ya)
        this.Ya *= this.Winged ? 0.95 : 0.85
        if (this.OnGround) {
            this.Xa *= this.GroundInertia
        } else {
            this.Xa *= this.AirInertia
        }

        if (!this.OnGround) {
            if (this.Winged) {
                this.Ya += 0.6
            } else {
                this.Ya += 2
            }
        } else if (this.Winged) {
            this.Ya = -10
        }

        if (this.Winged) {
            runFrame = ((this.WingTime / 4) | 0) % 2
        }

        this.XPic = runFrame
    }
    SubMove(xa, ya) {
        // subpixel movement
        let collide = false
        while (xa > 8) {
            if (!this.SubMove(8,0)) {
                return false
            }
            xa -= 8
        }
        while (xa < -8) {
            if (!this.SubMove(-8,0)) {
                return false
            }
            xa += 8
        }
        while (ya > 8) {
            if (!this.SubMove(0,8)) {
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
            if (this.IsBlocking(this.X + xa, this.Width, this.Y + ya, xa, 0)) {
                collide = true
            } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
                collide = true
            } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
                collide = true
            } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
                collide = true
            }
        }
        if (xa > 0) {
            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            }
            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            }
            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
                collide = true;
            }

            if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa + this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
                collide = true;
            }
        }
        if (xa < 0) {
            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            }
            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            }
            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
                collide = true;
            }

            if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa - this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
                collide = true;
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
    IsBlocking(x, y, xa, ya) {
        // is blocking
        x = (x / 16) | 0
        y = (y / 16) | 0

        if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
            return false
        }

        return this.World.Level.IsBlocking(x, y, xa, ya)
    }
    BumpCheck (xTile, yTile) {
        // check for bump
        if (this.DeatTime != 0) {
            return
        }

        if (this.X + this.Width > xTile * 16 && this.X - this.Width < xTile *16 + 16 && yTile === ((this.Y - 1) / 16) | 0) {
            this.Xa = -Game.Character.Facing * 2
            this.Ya = -5
            this.FlyDeath = true
            if (this.SpriteTemplate != null) {
                this.SpriteTemplate.IsDead = true
            }
            this.DeadTime = 100
            this.Winged = false
            this.YFlip = true
        }
    }
    Draw(context, camera) {
        // draw enemy
        xPixel = ((this.XOld + (this.Y - this.XOld) * this.Delta) | 0) - this.XPic0
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPic0

        if (this.Type != Game.Enemy.RedKoopa && this.Type != Game.Enemy.GreenKoopa) {
            this.XFlip = !this.XFlip
            context.save()
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0)
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32, this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32)
            context.restore()
            this.XFlip = !this.XFlip
        }

        this.SubDraw(context, camera)
        if (this.Winged) {
            if (this.Type === Game.Enemy.RedKoopa && this.Type === Game.Enemy.GreenKoopa) {
                this.XFlip = !this.XFlip
                context.save()
                context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
                context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0)
                context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32, this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32)
                context.restore()
                this.XFlip = !this.XFlip
            } else {
                context.save()
                context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
                context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0)
                context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32, this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32)
                context.restore()
            }
     }
    }
}

// Game.Enemy.prototype = new Game.Sprite()
// Game.Enemy.prototype.SubDraw = Game.Sprite().prototype.Draw

Game.Enemy.RedKoopa = 0
Game.Enemy.GreenKoopa = 1
Game.Enemy.Goomba = 2
Game.Enemy.Spiky = 3
Game.Enemy.Flower = 4

Game.FlowerEnemy = class {
    constructor(world, x, y) {
        this.Image = Engine.Resources.Images["enemies"]
        this.World = world
        this.X = x
        this.Y = y
        this.Facing = 1
        this.Type = Game.Enemy.Spiky
        this.Winged = false
        this.XPic = 0
        this.YPic = 6
        this.YPic0 = 24
        this.Height = 12
        this.Width = 2
        this.YStart = y
        this.Ya = -8
        this.Y -= 1
        this.Layer = 0
        this.JumpTime = 0
        this.Tick = 0
        let i = 0
        for (i = 0; i < 4; i++) {
            this.Move()
        }
    }
    Move() {
        let i =0, xd = 0
        if (this.DeadTime > 0) {
            this.DeadTime--

            if (this.DeadTime === 0) {
                this.DeadTime = 1
                for (i = 0; i < 8; i++) {
                    this.World.AddSprite(new Game.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 -1, Math.random() * -1, 0, 1, 5))
                }
                this.World.RemoveSprite(this)
            }

            this.X += this.Xa
            this.Y += this.Ya
            this.Ya *= 0.95
            this.Ya += 1
            return
        }
        this.Tick++
        if (this.Y >= this.YStart) {
            this.YStart = this.Y
            xd = Math.abs(Game.Character.X - this.X) | 0
            this.JumpTime++
            if (this.JumpTime > 40 && xd > 24) {
                this.Ya = -8
            } else {
                this.Ya = 0
            }
        } else {
            this.JumpTime = 0
        }

        this.Y += this.Ya
        this.Ya *= 0.9
        this.Ya += 0.1

        this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1)
    }
}

Game.FlowerEnemy.prototype = new Game.Enemy()