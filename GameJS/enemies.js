/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/


Game.Enemy = function(world, x, y, dir, type, winged) {
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
    this.WingTime = 0
    
    this.X = x
    this.Y = y
    this.World = world
    
    this.Type = type
    this.Winged = winged
    
    this.Image = Engine.Resources.Images["enemies"]
    
    this.XPicO = 8
    this.YPicO = 31
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
};

Game.Enemy.prototype = new Game.GameSprite()

Game.Enemy.prototype.CollideCheck = function() {
    if (this.DeadTime !== 0) {
        return
    }
    
    var xMainD = Game.Main.X - this.X, yMainD = Game.Main.Y - this.Y
        
    if (xMainD > -this.Width * 2 - 4 && xMainD < this.Width * 2 + 4) {
        if (yMainD > -this.Height && yMainD < Game.Main.Height) {
            if (this.Type !== Game.Enemy.Spiky && Game.Main.Ya > 0 && yMainD <= 0 && (!Game.Main.OnGround || !Game.Main.WasOnGround)) {
                Game.Main.Stomp(this)
                if (this.Winged) {
                    this.Winged = false
                    this.Ya = 0
                } else {
                    this.YPicO = 31 - (32 - 8)
                    this.PicHeight = 8
                    
                    if (this.SpriteTemplate !== null) {
                        this.SpriteTemplate.IsDead = true
                    }
                    
                    this.DeadTime = 10
                    this.Winged = false
                    
                    if (this.Type === Game.Enemy.RedKoopa) {
                        this.World.AddSprite(new Game.Shell(this.World, this.X, this.Y, 0))
                    } else if (this.Type === Game.Enemy.GreenKoopa) {
                        this.World.AddSprite(new Game.Shell(this.World, this.X, this.Y, 1))
                    }
                }
            } else {
                Game.Main.GetHurt()
            }
        }
    }
}

Game.Enemy.prototype.Move = function() {
    var i = 0, sideWaysSpeed = 1.75, runFrame = 0

    this.WingTime++
    if (this.DeadTime > 0) {
        this.DeadTime--
        
        if (this.DeadTime === 0) {
            this.DeadTime = 1
            for (i = 0; i < 8; i++) {
              this.World.AddSprite(new Game.Sparkle(this.World, ((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y - Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5))
            }
            this.World.RemoveSprite(this)
        }
        
        if (this.FlyDeath) {
            this.X += this.Xa
            this.Y += this.Ya
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
};

Game.Enemy.prototype.SubMove = function(xa, ya) {
    var collide = false
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
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
    while (ya > 8) {
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
            collide = true
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        }
    }
    
    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true
        }
        
        if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa + this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
            collide = true
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true
        }
        
        if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa - this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
            collide = true
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width
            this.Xa = 0
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1
            this.Xa = 0
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height
            this.JumpTime = 0
            this.Ya = 0
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1
            this.OnGround = true
        }
        
        return false
    } else {
        this.X += xa
        this.Y += ya
        return true
    }
};

Game.Enemy.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0
    y = (y / 16) | 0
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false
    }
    
    return this.World.Level.IsBlocking(x, y, xa, ya)
};

Game.Enemy.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false
    }
    
    var xd = shell.X - this.X, yd = shell.Y - this.Y
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < shell.Height) {         
            this.Xa = shell.Facing * 2
            this.Ya = -5
            this.FlyDeath = true
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true
            }
            this.DeadTime = 100
            this.Winged = false
            this.YFlip = true
            return true
        }
    }
    return false
};

Game.Enemy.prototype.BumpCheck = function(xTile, yTile) {
    if (this.DeadTime !== 0) {
        return
    }
    
    if (this.X + this.Width > xTile * 16 && this.X - this.Width < xTile * 16 + 16 && yTile === ((this.Y - 1) / 16) | 0) {
        this.Xa = -Game.Main.Facing * 2
        this.Ya = -5
        this.FlyDeath = true
        if (this.SpriteTemplate !== null) {
            this.SpriteTemplate.IsDead = true
        }
        this.DeadTime = 100
        this.Winged = false
        this.YFlip = true
    }
};

Game.Enemy.prototype.SubDraw = Game.GameSprite.prototype.Draw

Game.Enemy.prototype.Draw = function(context, camera) {
    var xPixel = 0, yPixel = 0
    
    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO
        
        if (this.Type !== Game.Enemy.RedKoopa && this.Type !== Game.Enemy.GreenKoopa) {
            this.XFlip = !this.XFlip
            context.save()
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0)
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32)
            context.restore()
            this.XFlip = !this.XFlip
        }
    }
    
    this.SubDraw(context, camera)
    
    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO
        
        if (this.Type === Game.Enemy.RedKoopa && this.Type === Game.Enemy.GreenKoopa) {
            context.save()
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0)
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel) : yPixel - 8, 16, 32)
            context.restore()
        } else {
            context.save()
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1)
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0)
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32)
            context.restore()
        }
    }
};

//Static variables
Game.Enemy.RedKoopa = 0
Game.Enemy.GreenKoopa = 1
Game.Enemy.Galoomba = 2
Game.Enemy.Spiky = 3


Game.Shell = function(world, x, y, type) {
	this.World = world
	this.X = x
	this.Y = y
	
	this.YPic = type
	this.Image = Engine.Resources.Images["enemies"]
	
	this.XPicO = 8
	this.YPicO = 31
	this.Width = 4
	this.Height = 12
	this.Facing = 0
	this.PicWidth = 16
	this.XPic = 4
	this.Ya = -5
	
	this.Dead = false
	this.DeadTime = 0
	
	this.GroundInertia = 0.89
	this.AirInertia = 0.89
	this.OnGround = false
	this.Anim = 0
};

Game.Shell.prototype = new Game.GameSprite()


Game.Shell.prototype.CollideCheck = function() {
	if (this.Dead || this.DeadTime > 0) {
		return
	}
	
	var xMainD = Game.Main.X - this.X, yMainD = Game.Main.Y - this.Y;
	if (xMainD > -16 && xMainD < 16) {
        if (yMainD > -this.Height && yMainD < Game.Main.Height) {
			if (Game.Main.Ya > 0 && yMainD <= 0 && (!Game.Main.OnGround || !Game.Main.WasOnGround)) {
				Game.Main.Stomp(this)
				if (this.Facing !== 0) {
					this.Xa = 0
					this.Facing = 0
				} else {
					this.Facing = Game.Main.Facing
				}
			} else {
				if (this.Facing !== 0) {
					Game.Main.GetHurt()
				} else {
					Game.Main.Kick(this)
					this.Facing = Game.Main.Facing
				}
			}
		}
	}
};

Game.Shell.prototype.Move = function() {
	var sideWaysSpeed = 11, i = 0
	
	if (this.DeadTime > 0) {
		this.DeadTime--
		
		if (this.DeadTime === 0) {
			this.DeadTime = 1
			for (i = 0; i < 8; i++) {
              this.World.AddSprite(new Game.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5))
            }
			this.World.RemoveSprite(this)
		}
		
		this.X += this.Xa
		this.Y += this.Ya
		this.Ya *= 0.95
		this.Ya += 1
		return
	}
	
	if (this.Facing !== 0) {
		this.Anim++
	}
	
	if (this.Xa > 2) {
		this.Facing = 1
	}
	if (this.Xa < -2) {
		this.Facing = -1
	}
	
	this.Xa = this.Facing * sideWaysSpeed
	
	if (this.Facing !== 0) {
		this.World.CheckShellCollide(this)
	}
	
	this.XFlip = this.Facing === -1
	
	this.XPic = ((this.Anim / 2) | 0) % 4 + 3
    
    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing
    }
    this.OnGround = false
    this.SubMove(0, this.Ya)
    
    this.Ya *= 0.85
    if (this.OnGround) {
        this.Xa *= this.GroundInertia
    } else {
        this.Xa *= this.AirInertia
    }
    
    if (!this.OnGround) {
        this.Ya += 2
    }
};

Game.Shell.prototype.SubMove = function(xa, ya) {
    var collide = false
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
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
    while (ya > 8) {
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
            collide = true
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        }
    }
    
    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width
            this.Xa = 0
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1
            this.Xa = 0
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height
            this.Ya = 0
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1
            this.OnGround = true
        }
        
        return false
    } else {
        this.X += xa
        this.Y += ya
        return true
    }
};

Game.Shell.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0
    y = (y / 16) | 0
    
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false
    }
    
    var blocking = this.World.Level.IsBlocking(x, y, xa, ya)
    
    if (blocking && ya === 0 && xa !== 0) {
        this.World.Bump(x, y, true)
    }
    return blocking
};

Game.Shell.prototype.BumpCheck = function(x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 + 16 && y === (((this.Y - 1) / 16) | 0)) {
        this.Facing = -Game.Main.Facing
        this.Ya = -10
    }
};

Game.Shell.prototype.Die = function() {
    this.Dead = true
    this.Xa = -this.Facing * 2
    this.Ya = -5
    this.DeadTime = 100
};

Game.Shell.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false
    }
    
    var xD = shell.X - this.X, yD = shell.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < shell.Height) {
            this.Die()
            shell.Die()
            return true
        }
    }
    return false
};

Game.Shell.prototype.Release = function(Main) {
    this.Facing = Game.Main.Facing
    this.X += this.Facing * 8
}
