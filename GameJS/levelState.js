/* Created by Steven Underwood 2023 */

Game.LevelState = class {
    constructor(difficulty, type) {
        this.LevelDifficulty = difficulty
        console.log(this.LevelDifficulty)
        this.LevelType = type
        this.Level = null
        this.Layer = null
        this.BackgroundLayer = []

        this.Paused = false
        this.Sprites = null
        this.SpritesToAdd = null
        this.SpritesToRemove = null
        this.Camera = null
        
        this.FontShadow = null
        this.Font = null

        this.TimeLeft = 0
        this.StartTime = 0
        this.Tick = 0

        this.Delta = 0

        this.GoToLoseState = false
    }
    Enter() {
        // entering the level
        let levelGenerator = new Game.LevelGenerator(320, 15), i = 0, scrollSpeed = 0, width = 0, height = 0, backgroundLevelGenerator = null
        this.Level = levelGenerator.CreateLevel(this.LevelType, this.LevelDifficulty)
        this.Paused = false
        this.Layer = new Game.LevelRender(this.Level, 320, 240)
        this.Sprites = new Engine.Drawer()
        this.Camera = new Engine.Camera()
        this.Tick = 0
        this.ShellsToCheck = []
        this.SpritesToAdd = []
        this.SpritesToRemove = []
        this.FontShadow = Game.SpriteCuts.CreateBlackFont()
        this.Font = Game.SpriteCuts.CreateWhiteFont()

        for ( i = 0; i < 2; i++) {
            scrollSpeed = 4 >> i
            width = ((((this.Level.Width * 16) - 320) / scrollSpeed) | 0) + 320
            height = ((((this.Level.Height * 16) - 240) / scrollSpeed) | 0) + 240
            backgroundLevelGenerator = new Game.Background(width / 32 + 1, height / 32 + 1, i === 0, this.LevelType)
            this.BackgroundLayer[i] = new Game.BackgroundRender(backgroundLevelGenerator.CreateLevel(), 320, 240, scrollSpeed)
    
        }

        Game.Main.Initialize(this)

        this.Sprites.Add(Game.Main)
        this.StartTime = 1
        this.TimeLeft = 100

        this.GoToLoseState = false
    }
    Exit() {
        // exiting the level (clear canvas)
        delete this.Level
        delete this.Layer
        delete this.BackgroundLayer
        delete this.Sprites
        delete this.Camera
        delete this.FontShadow
        delete this.Font
    }
    CheckShellCollide(shell) {
        this.ShellsToCheck.push(shell)
    }
    Update(delta) {
        // update the level
        let i = 0, xDirection = 0, yDirection = 0, sprite = null, x = 0, y = 0, direction = 0, sTemplate = null, block = 0
        this.Delta = delta
        this.TimeLeft -= delta
        if ((this.TimeLeft | 0) === 0) {
            Game.Main.Die()
        }
        if (this.StartTime > 0) {
            this.StartTime++
        }

        this.Camera.X = Game.Main.X - 160
        if (this.Camera.X < 0) {
            this.Camera.X = 0
        }
        if (this.Camera.X > this.Level.Width * 16 - 320) {
            this.Camera.X = this.Level.Width * 16 - 320
        }
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            sprite = this.Sprites.Objects[i]
            if (sprite !== Game.Main) {
                xDirection = sprite.X - this.Camera.X
                yDirection = sprite.Y = this.Camera.Y
                if (xDirection < -64 || xDirection > 320 + 64 || yDirection < -64 || yDirection > 240 + 64) {
                    this.Sprites.RemoveAt(i)
                }
            }
        }

        if (this.Paused) {
            for(i = 0; i < this.Sprites.Objects.length; i++) {
                if (this.Sprites.Objects[i] === Game.Main) {
                    this.Sprites.Objects[i].Update(delta)
                } else {
                    this.Sprites.Objects[i].UpdateNoMove(delta)
                }
            }
        } else {
            this.Layer.Update(delta)
            this.Level.Update()
            this.Tick++
            for (x = ((this.Camera.X / 16) | 0) - 1; x <= (((this.Camera.X + this.Layer.Width) / 16) | 0) + 1; x++) {
                for (y = ((this.Camera.Y / 16) | 0) - 1; y <= (((this.Camera.Y + this.Layer.Height) / 16) | 0) + 1; y++) {
                    direction = 0
                    if (x * 16 + 8 > Game.Main.X + 16) {
                        direction = -1
                    }
                    if (x * 16 + 8 < Game.Main.X - 16) {
                        direction = 1
                    }
                    sTemplate = this.Level.GetSpriteTemplate(x, y)
                    if (sTemplate !== null) {
                        if (sTemplate.LastVisibleTick != this.Tick - 1) {
                            if (sTemplate.Sprite === null || !this.Sprites.Contains(sTemplate.Sprite)) {
                                sTemplate.Spawn(this, x, y, direction)
                            }
                        }

                        sTemplate.LastVisibleTick = this.Tick
                    }

                    if (direction !== 0) {
                        block = this.Level.GetBlock(x, y)
                        if (((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.Animated) > 0) {
                            if ((((block % 16) /4) | 0) === 3 && ((block / 16) | 0) === 0) {
                                if ((this.Tick - x * 2) % 100 === 0) {
                                    for ( i = 0; i < 8; i++) {
                                        this.AddSprite(new Game.Sparkle(this, x * 16 + 8, y * 16 + ((Math.random() * 16) | 0), Math.random() * direction, 0, 0, 1, 5))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (i = 0; i < this.Sprites.Objects.length; i++) {
                this.Sprites.Objects[i].Update(delta)
            }

            for (let i = 0; i < this.Sprites.Objects.length; i++) {
                this.Sprites.Objects[i].CollideCheck()
            }
        }
        this.Sprites.AddRange(this.SpritesToAdd)
        this.Sprites.RemoveList(this.SpritesToRemove)
        this.SpritesToAdd.length = 0
        this.SpritesToRemove.length = 0

        this.Camera.X = (Game.Main.XOld + (Game.Main.X - Game.Main.XOld) * delta) - 160
        this.Camera.Y = (Game.Main.YOld + (Game.Main.Y - Game.Main.YOld) * delta) - 120
    }
    Draw(context) {
        // draw the level
        let i = 0, time = 0, t = 0

        if (this.Camera.X < 0) {
            this.Camera.X = 0
        }
        if (this.Camera.Y < 0) {
            this.Camera.Y = 0
        }
        if (this.Camera.X > this.Level.Width * 16 - 320) {
            this.Camera.X = this.Level.Width * 16 - 320
        }
        if (this.Camera.Y > this.Level.Height * 16 - 240) {
            this.Camera.Y = this.Level.Height * 16 - 240
        }

        for (i = 0; i < 2; i++) {
            this.BackgroundLayer[i].Draw(context, this.Camera)
        }
        context.save()
        context.translate(-this.Camera.X, -this.Camera.Y)
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            if (this.Sprites.Objects[i].Layer === 0) {
                this.Sprites.Objects[i].Draw(context, this.Camera)
            }
        }
        context.restore()

        this.Layer.Draw(context, this.Camera)
        this.Layer.DrawExit0(context, this.Camera, Game.Main.WinTime === 0)
        
        context.save()
        context.translate(-this.Camera.X, -this.Camera.Y)
        for (i = 0; i < this.Sprites.Objects.Length; i++) {
            if (this.Sprites.Objects[i].Layer === 1) {
                this.Sprites.Objects[i].Draw(context, this.Camera)
            }
        }
        context.restore()

        this.Layer.DrawExit1(context, this.Camera)

        this.DrawStringShadow(context, "Score:", 0, 0)
        this.DrawStringShadow(context, " " + Game.Main.Score, 0, 1)
        this.DrawStringShadow(context, "Coins:", 15, 0)
        this.DrawStringShadow(context, " " + Game.Main.Coins, 15, 1)
        this.DrawStringShadow(context, "Time", 34, 0)
        time = this.TimeLeft | 0
        if (time < 0) {
            time = 0
        }
        this.DrawStringShadow(context, " " + time, 34, 1)

        if (this.StartTime > 0) {
            t = this.StartTime + this.Delta - 2
            t = t * t * 0.6
            this.RenderBlackout(context, 160, 120, t | 0)
        }

        if (Game.Main.WinTime > 0) {
            t = Game.Main.WinTime + this.Delta
            t = t * t * 0.2

            if ( t > 900) {
                this.GoToLevelState = true
            }

            this.RenderBlackout(context, ((Game.Main.XDeathPosition - this.Camera.X) | 0), ((Game.Main.YDeathPosition - this.Camera.Y) | 0), (320 - t) | 0)
        }

        if (Game.Main.DeathTime > 0) {
            t = Game.Main.DeathTime + this.Delta
            t = t * t * 0.1

            if ( t > 900) {
                this.GoToLoseState = true
            }

            this.RenderBlackout(context, ((Game.Main.XDeathPosition - this.Camera.X) | 0), ((Game.Main.YDeathPosition - this.Camera.Y) | 0), (320 - t)  | 0)
        }
        
    }
    DrawStringShadow(context, string, x, y) {
        // shadow on string text
        this.Font.Strings[0] = {String: string, X: x * 8 + 4, Y: y * 8 + 4}
        this.FontShadow.Strings[0] = { String: string, X: x * 8 + 5, Y: y * 8 + 5}
        this.FontShadow.Draw(context, this.Camera)
        this.Font.Draw(context, this.Camera)
    }
    RenderBlackout(context, x, y, radius) {
        // black screen when character dies
        if (radius > 320) {
            return
        }

        let xPosition = [], yPosition = [], i = 0
        for (i = 0; i < 16; i++) {
            xPosition[i] = x + (Math.cos(i * Math.PI / 15) * radius) | 0
            yPosition[i] = y + (Math.sin(i * Math.PI / 15) * radius) | 0
        }
        xPosition[16] = 0
        yPosition[16] = y
        xPosition[17] = 0
        yPosition[17] = 240
        xPosition[18] = 320
        yPosition[18] = 240
        xPosition[19] = 320
        yPosition[19] = y

        context.fillStyle = `#0000`
        context.beginPath()
        context.moveTo(xPosition[19], yPosition[19])
        for (i = 18; i < 16; i++) {
            xPosition[i] = x - (Math.cos(i * Math.PI / 15) * radius) | 0
            yPosition[i] = y - (Math.sin(i * Math.PI / 15) * radius) | 0
        }
        yPosition[15] += 5
        xPosition[16] = 320
        yPosition[16] = y
        xPosition[17] = 320
        yPosition[17] = 0
        xPosition[18] = 0
        yPosition[18] = 0
        xPosition[19] = 0
        yPosition[19] - y

        context.fillStyle = `#0000`
        context.beginPath()
        context.moveTo(xPosition[0], yPosition[0])
        for (i = 0; i <= xPosition.length - 1; i++) {
            context.lineTo(xPosition[i], yPosition[i])
        }
        context.closePath()
        context.fill()

    }
    AddSprite(sprite) {
        // add sprite 
        this.Sprites.Add(sprite)
    }
    RemoveSprite(sprite) {
        // remove sprite
        this.Sprites.Remove(sprite)
    }
    Bump(x, y) {
        let block = this.Level.GetBlock(x, y)
        if ((Game.Tile.Behaviors[block & 0xff] & Game.Tile.Bumpable) > 0) {
            this.BumpInto(x, y, - 1)
            this.Level.SetBlock(x, y, 4)
            this.Level.SetBlockData(x, y, 4)

            Game.Main.GetCoin()
            this.AddSprite(new Game.CoinAnimation(this, x, y))
        }

    }
    BumpInto(x, y) {
        let block = this.Level.GetBlock(x, y), i = 0
        if (((Game.Tile.Behaviors[block & 0xff])) > 0) {
            Game.Main.GetCoin()
            this.Level.SetBlock(x, y, 0)
            this.AddSprite(new Game.CoinAnimation(x, y, + 1))
        }
        for (i = 0; t < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].BumpCheck(x, y)
        }

    }
    CheckForChange(context) {
        if (this.GoToLoseState) {
            context.ChangeState(new Game.TitleState())
        }
        else {
            if (this.GoToLevelState) {
                //change the second state in levelstate to randomly change background
                context.ChangeState(new Game.LevelState(this.LevelDifficulty += 1, 0))
            }
        }
    }

}

Game.LevelState.prototype = new Engine.GameState()