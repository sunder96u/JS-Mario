

Game.Character = function() {
    //these are static
    this.Coins = 0
    this.Score = 0
    this.LevelString = "none"
    this.GroundInertia = 0.89
    this.AirInertia = 0.89
    
    //non static
    this.RunTime = 0
    this.WasOnGround = false
    this.OnGround = false
    this.MayJump = false
    this.JumpTime = 0
    this.XJumpSpeed = 0
    this.YJumpSpeed = 0
    //Pixel Width of Sprite
    this.Width = 4
    this.Height = 24
    
    //Level scene
    this.World = null
    this.Facing = 0
    this.XDeathPos = 0
    this.YDeathPos = 0
    this.DeathTime = 0
    this.WinTime = 0
    this.InvulnerableTime = 0
    
}

Game.Character.prototype = new Game.GameSprite(null)

Game.Character.prototype.Initialize = function(world) {

    this.World = world
    this.X = 32
    this.Y = 0
    //non static
    this.RunTime = 0
    this.WasOnGround = false
    this.OnGround = false
    this.MayJump = false
    this.JumpTime = 0
    this.XJumpSpeed = 0
    this.YJumpSpeed = 0
    //Sprite Size
    this.Width = 4
    this.Height = 24
    //Level scene
    this.World = world
    this.Facing = 0
    this.PowerUpTime = 0 
    this.XDeathPos = 0
    this.YDeathPos = 0
    this.DeathTime = 0
    this.WinTime = 0
    this.InvulnerableTime = 0
    //Sprite  
    this.Blink(true)
}

Game.Character.prototype.Blink = function(on) {
    //Draws the main character sprite   
    this.Image = Engine.Resources.Images["character"]
    this.XPicO = 8
    this.YPicO = 15
    this.PicWidth = this.PicHeight = 16
}

Game.Character.prototype.Move = function() {
    //Sets up win condition
    if (this.WinTime > 0) {
        this.WinTime++
        this.Xa = 0
        this.Ya = 0
        return
    }
    //Sets up death condition
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
        return;
    }
    if (this.InvulnerableTime > 0) {
        this.InvulnerableTime--
    }
    this.Visible = (((this.InvulerableTime / 2) | 0) & 1) === 0
    this.WasOnGround = this.OnGround
    let sideWaysSpeed = (Engine.KeyInput.IsKeyDown(Engine.Keys.S) ? 1.2 : 0.6) || (Engine.KeyInput.IsKeyDown(Engine.Keys.Down) ? 1.2 : 0.6);           
    if (this.Xa > 2) {
        this.Facing = 1
    }
    if (this.Xa < -2) {
        this.Facing = -1
    }
    if ((Engine.KeyInput.IsKeyDown(Engine.Keys.W) || Engine.KeyInput.IsKeyDown(Engine.Keys.Up)) || (this.JumpTime < 0 && !this.OnGround)) {
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
            this.XJumpSpeed = -this.Facing * 6
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
        this.JumpTime = 0;
    }
    
    if ((Engine.KeyInput.IsKeyDown(Engine.Keys.Left) || Engine.KeyInput.IsKeyDown(Engine.Keys.A))) {
        if (this.Facing === 1) {
            this.Sliding = false
        }
        this.Xa -= sideWaysSpeed
        if (this.JumpTime >= 0) {
            this.Facing = -1
        }
    }
    
    if ((Engine.KeyInput.IsKeyDown(Engine.Keys.Right) || Engine.KeyInput.IsKeyDown(Engine.Keys.D))) {
        if (this.Facing === -1) {
            this.Sliding = false
        }
        this.Xa += sideWaysSpeed;
        if (this.JumpTime >= 0) {
            this.Facing = 1
        }
        
        if (Math.floor(this.X) % 2 === 0) {
            this.Score += 1
        }
    }
    
    if ((!Engine.KeyInput.IsKeyDown(Engine.Keys.Left) && !Engine.KeyInput.IsKeyDown(Engine.Keys.Right)) || (!Engine.KeyInput.IsKeyDown(Engine.Keys.A) && !Engine.KeyInput.IsKeyDown(Engine.Keys.D)) || this.Ya < 0 || this.OnGround) {
        this.Sliding = false  
    }
        
    this.MayJump = (this.OnGround || this.Sliding) && (!Engine.KeyInput.IsKeyDown(Engine.Keys.W) || !Engine.KeyInput.IsKeyDown(Engine.Keys.Up))
    this.XFlip = (this.Facing === -1)
    this.RunTime += Math.abs(this.Xa) + 5
    
    if (Math.abs(this.Xa) < 0.5) {
        this.RunTime = 0
        this.Xa = 0
    }
    
    this.CalcPic()
    
    if (this.Sliding) {
       this.World.AddSprite(new Game.Sparkle(this.World, ((this.X + Math.random() * 4 - 2) | 0) + this.Facing * 8,
          ((this.Y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5))
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
    
    if (this.X > this.World.Level.ExitX * 16) {
        this.Win()
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
    
};

Game.Character.prototype.CalcPic = function() {
    var runFrame = 0, i = 0

        runFrame = ((this.RunTime / 20) | 0) % 2
        if (!this.OnGround) {
            if (Math.abs(this.Xa) > 10) {
                runFrame = 5
            } else {
                runFrame = 4
            }
        }
    
    if (this.OnGround && ((this.Facing === -1 && this.Xa > 0) || (this.Facing === 1 && this.Xa < 0))) {
        if (this.Xa > 3 || this.Xa < -3) {
            for (i = 0; i < 3; i++) {
               this.World.AddSprite(new Game.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5))
            }
        }
    }
    this.Height = 12
       
    this.XPic = runFrame
};

Game.Character.prototype.SubMove = function(xa, ya) {
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
            return false;
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
        this.Sliding = true
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        } else {
            this.Sliding = false
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true
        } else {
            this.Sliding = false
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true
        } else {
            this.Sliding = false
        }
    }
    if (xa < 0) {
        this.Sliding = true;
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true
        } else {
            this.Sliding = false
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true
        } else {
            this.Sliding = false
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true
        } else {
            this.Sliding = false
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

Game.Character.prototype.IsBlocking = function(x, y, xa, ya) {
    var blocking = false, block = 0, xx = 0, yy = 0
    
    x = (x / 16) | 0
    y = (y / 16) | 0
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false
    }
    
    block = this.World.Level.GetBlock(x, y)
    
    if (((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.PickUpable) > 0) {
        this.GetCoin()
        this.World.Level.SetBlock(x, y, 0)
        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                this.World.AddSprite(new Game.Sparkle(this.World, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5))
            }
        }
    }
    
    blocking = this.World.Level.IsBlocking(x, y, xa, ya)
    if (blocking && ya < 0) {
        this.World.Bump(x, y)
    }
    return blocking
}

Game.Character.prototype.Stomp = function(object) {
    var targetY = 0
    this.Score += 100

    if (this.DeathTime > 0 || this.World.Paused) {
        return
    }
    
    targetY = object.Y - object.Height / 2
    this.SubMove(0, targetY - this.Y)
            
        this.XJumpSpeed = 0
        this.YJumpSpeed = -1.9
        this.JumpTime = 8
        this.Ya = this.JumpTime * this.YJumpSpeed
        this.OnGround = false
        this.Sliding = false
        this.InvulnerableTime = 1

}

Game.Character.prototype.GetHurt = function() {
    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }
    if (this.InvulnerableTime > 0) {
        return;
    }
    this.Die();

};

Game.Character.prototype.Win = function() {
    this.XDeathPos = this.X | 0
    this.YDeathPos = this.Y | 0
    this.World.Paused = true
    this.WinTime = 1
    this.Score += 10000
}

Game.Character.prototype.Die = function() {
    this.XDeathPos = this.X | 0
    this.YDeathPos = this.Y | 0
    this.World.Paused = true
    this.DeathTime = 1
}


Game.Character.prototype.Kick = function(shell) {
    if (this.DeathTime > 0 && this.World.Paused) {
        return
    }
    this.InvulnerableTime = 1
    this.Score += 1000
}

Game.Character.prototype.GetCoin = function() {
    this.Coins++
    this.Score += 100
}