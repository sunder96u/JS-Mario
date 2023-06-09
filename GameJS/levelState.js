/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Game.LevelState = class {
    constructor(difficulty, type) {
        this.LevelDifficulty = difficulty;
        this.LevelType = type;
        this.Level = null;
        this.Layer = null;
        this.BgLayer = [];

        this.Paused = false;
        this.Sprites = null;
        this.SpritesToAdd = null;
        this.SpritesToRemove = null;
        this.Camera = null;

        this.FontShadow = null;
        this.Font = null;

        this.TimeLeft = 0;
        this.StartTime = 0;
        this.Tick = 0;

        this.Delta = 0;

        this.GotoMapState = false;
        this.GotoLoseState = false;
    }
    Enter() {
        var levelGenerator = new Game.LevelGenerator(320, 15), i = 0, scrollSpeed = 0, w = 0, h = 0, bgLevelGenerator = null;
        this.Level = levelGenerator.CreateLevel(this.LevelType, this.LevelDifficulty);

        this.Paused = false;
        this.Layer = new Game.LevelRenderer(this.Level, 320, 240);
        this.Sprites = new Engine.Drawer();
        this.Camera = new Engine.Camera();
        this.Tick = 0;

        this.ShellsToCheck = [];
        this.SpritesToAdd = [];
        this.SpritesToRemove = [];

        this.FontShadow = Game.SpriteCuts.CreateBlackFont();
        this.Font = Game.SpriteCuts.CreateWhiteFont();

        for (i = 0; i < 2; i++) {
            scrollSpeed = 4 >> i;
            w = ((((this.Level.Width * 16) - 320) / scrollSpeed) | 0) + 320;
            h = ((((this.Level.Height * 16) - 240) / scrollSpeed) | 0) + 240;
            bgLevelGenerator = new Game.Background(w / 32 + 1, h / 32 + 1, i === 0, this.LevelType);
            this.BgLayer[i] = new Game.BackgroundRender(bgLevelGenerator.CreateLevel(), 320, 240, scrollSpeed);
        }

        Game.Main.Initialize(this);
        this.Sprites.Add(Game.Main);
        this.StartTime = 1;
        this.GotoMapState = false;
        this.GotoLoseState = false;
    }
    Exit() {

        delete this.Level;
        delete this.Layer;
        delete this.BgLayer;
        delete this.Sprites;
        delete this.Camera;
        delete this.FontShadow;
        delete this.Font;
    }
    CheckShellCollide(shell) {
        this.ShellsToCheck.push(shell);
    }
    Update(delta) {
        let i = 0, xd = 0, yd = 0, sprite = null, x = 0, y = 0, dir = 0, st = null, b = 0;

        this.Delta = delta;

        if (this.StartTime > 0) {
            this.StartTime++;
        }

        this.Camera.X = Game.Main.X - 160;
        if (this.Camera.X < 0) {
            this.Camera.X = 0;
        }
        if (this.Camera.X > this.Level.Width * 16 - 320) {
            this.Camera.X = this.Level.Width * 16 - 320;
        }

        
        for (i = 0; i < this.Sprites.Objects.length; i++) {

            sprite = this.Sprites.Objects[i];
            if (sprite !== Game.Main) {
                xd = sprite.X - this.Camera.X;
                yd = sprite.Y - this.Camera.Y;
                if (xd < -64 || xd > 320 + 64 || yd < -64 || yd > 240 + 64) {
                    this.Sprites.RemoveAt(i);
                }
            }
        }

        if (this.Paused) {
            for (i = 0; i < this.Sprites.Objects.length; i++) {
                if (this.Sprites.Objects[i] === Game.Main) {
                    this.Sprites.Objects[i].Update(delta);
                } else {
                    this.Sprites.Objects[i].UpdateNoMove(delta);
                }
            }
        } else {
            this.Layer.Update(delta);
            this.Level.Update();

            this.Tick++;

            for (x = ((this.Camera.X / 16) | 0) - 1; x <= (((this.Camera.X + this.Layer.Width) / 16) | 0) + 1; x++) {
                for (y = ((this.Camera.Y / 16) | 0) - 1; y <= (((this.Camera.Y + this.Layer.Height) / 16) | 0) + 1; y++) {
                    dir = 0;

                    if (x * 16 + 8 > Game.Main.X + 16) {
                        dir = -1;
                    }
                    if (x * 16 + 8 < Game.Main.X - 16) {
                        dir = 1;
                    }

                    st = this.Level.GetSpriteTemplate(x, y);

                    if (st !== null) {
                        if (st.LastVisibleTick !== this.Tick - 1) {
                            if (st.Sprite === null || !this.Sprites.Contains(st.Sprite)) {
                                st.Spawn(this, x, y, dir);
                            }
                        }

                        st.LastVisibleTick = this.Tick;
                    }

                    if (dir !== 0) {
                        b = this.Level.GetBlock(x, y);
                        if (((Game.Tile.Behaviors[b & 0xff]) & Game.Tile.Animated) > 0) {
                            if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                                if ((this.Tick - x * 2) % 100 === 0) {
                                    for (i = 0; i < 8; i++) {
                                       this.AddSprite(new Game.Sparkle(this, x * 16 + 8, y * 16 + ((Math.random() * 16) | 0), Math.random() * dir, 0, 0, 1, 5));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            for (i = 0; i < this.Sprites.Objects.length; i++) {
                this.Sprites.Objects[i].Update(delta);
            }

            for (i = 0; i < this.Sprites.Objects.length; i++) {
                this.Sprites.Objects[i].CollideCheck();
            }

        }
        this.Sprites.AddRange(this.SpritesToAdd);
        this.Sprites.RemoveList(this.SpritesToRemove);
        this.SpritesToAdd.length = 0;
        this.SpritesToRemove.length = 0;

        this.Camera.X = (Game.Main.XOld + (Game.Main.X - Game.Main.XOld) * delta) - 160;
        this.Camera.Y = (Game.Main.YOld + (Game.Main.Y - Game.Main.YOld) * delta) - 120;
    }
    Draw(context) {
        var i = 0, time = 0, t = 0;

        if (this.Camera.X < 0) {
            this.Camera.X = 0;
        }
        if (this.Camera.Y < 0) {
            this.Camera.Y = 0;
        }
        if (this.Camera.X > this.Level.Width * 16 - 320) {
            this.Camera.X = this.Level.Width * 16 - 320;
        }
        if (this.Camera.Y > this.Level.Height * 16 - 240) {
            this.Camera.Y = this.Level.Height * 16 - 240;
        }

        for (i = 0; i < 2; i++) {
            this.BgLayer[i].Draw(context, this.Camera);
        }

        context.save();
        context.translate(-this.Camera.X, -this.Camera.Y);

        for (i = 0; i < this.Sprites.Objects.length; i++) {
            if (this.Sprites.Objects[i].Layer === 0) {
                this.Sprites.Objects[i].Draw(context, this.Camera);
            }
        }
        
        context.restore();

        this.Layer.Draw(context, this.Camera);
        this.Layer.DrawExit0(context, this.Camera, Game.Main.WinTime === 0);

        context.save();
        context.translate(-this.Camera.X, -this.Camera.Y);
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            if (this.Sprites.Objects[i].Layer === 1) {
                this.Sprites.Objects[i].Draw(context, this.Camera);
            }
        }
        context.restore();

        this.Layer.DrawExit1(context, this.Camera);

        this.DrawStringShadow(context, "SCORE: ", 0, 0);
        this.DrawStringShadow(context, " " + Game.Main.Score, 0, 1);
        this.DrawStringShadow(context, "COINS:", 32, 0);
        this.DrawStringShadow(context, " " + Game.Main.Coins, 32, 1);

        if (this.StartTime > 0) {
            t = this.StartTime + this.Delta - 2;
            t = t * t * 0.6;
            this.RenderBlackout(context, 160, 120, t | 0);
        }

        if (Game.Main.WinTime > 0) {
            t = Game.Main.WinTime + this.Delta;
            t = t * t * 0.2;

            if (t > 900) {
                //TODO: goto map state with level won
                this.GotoMapState = true;
            }

            this.RenderBlackout(context, ((Game.Main.XDeathPos - this.Camera.X) | 0), ((Game.Main.YDeathPos - this.Camera.Y) | 0), (320 - t) | 0);
        }

        if (Game.Main.DeathTime > 0) {
            t = Game.Main.DeathTime + this.Delta;
            t = t * t * 0.1;

            if (t > 900) {
                //TODO: goto map with level lost
                this.GotoLoseState = true;

            }

            this.RenderBlackout(context, ((Game.Main.XDeathPos - this.Camera.X) | 0), ((Game.Main.YDeathPos - this.Camera.Y) | 0), (320 - t) | 0);
        }
    }
    DrawStringShadow(context, string, x, y) {
        this.Font.Strings[0] = { String: string, X: x * 8 + 4, Y: y * 8 + 4 };
        this.FontShadow.Strings[0] = { String: string, X: x * 8 + 5, Y: y * 8 + 5 };
        this.FontShadow.Draw(context, this.Camera);
        this.Font.Draw(context, this.Camera);
    }
    RenderBlackout(context, x, y, radius) {
                // black screen when Main dies
                if (radius > 320) {
                    return;
                }
        
                var xp = [], yp = [], i = 0;
                for (i = 0; i < 16; i++) {
                    xp[i] = x + (Math.cos(i * Math.PI / 15) * radius) | 0;
                    yp[i] = y + (Math.sin(i * Math.PI / 15) * radius) | 0;
                }
                xp[16] = 0;
                yp[16] = y;
                xp[17] = 0;
                yp[17] = 240;
                xp[18] = 320;
                yp[18] = 240;
                xp[19] = 320;
                yp[19] = y;
        
                context.fillStyle = "#000";
                context.beginPath();
                context.moveTo(xp[19], yp[19]);
                for (i = 18; i >= 0; i--) {
                    context.lineTo(xp[i], yp[i]);
                }
                context.closePath();
                context.fill();
        
                for (i = 0; i < 16; i++) {
                    xp[i] = x - (Math.cos(i * Math.PI / 15) * radius) | 0;
                    yp[i] = y - (Math.sin(i * Math.PI / 15) * radius) | 0;
                }
                //cure a strange problem where the circle gets cut
                yp[15] += 5;
        
                xp[16] = 320;
                yp[16] = y;
                xp[17] = 320;
                yp[17] = 0;
                xp[18] = 0;
                yp[18] = 0;
                xp[19] = 0;
                yp[19] = y;
        
                context.fillStyle = "#000";
                context.beginPath();
                context.moveTo(xp[0], yp[0]);
                for (i = 0; i <= xp.length - 1; i++) {
                    context.lineTo(xp[i], yp[i]);
                }
                context.closePath();
                context.fill();
    }
    AddSprite(sprite) {
        this.Sprites.Add(sprite);
    }
    RemoveSprite(sprite) {
        this.Sprites.Remove(sprite);
    }
    Bump(x, y) {
        var block = this.Level.GetBlock(x, y);

        if ((Game.Tile.Behaviors[block & 0xff] & Game.Tile.Bumpable) > 0) {
            this.BumpInto(x, y - 1);
            this.Level.SetBlock(x, y, 4);
            this.Level.SetBlockData(x, y, 4);
            Game.Main.GetCoin()
        }

    }
    BumpInto(x, y) {
        var block = this.Level.GetBlock(x, y), i = 0;
        if (((Game.Tile.Behaviors[block & 0xff])) > 0) {
            Game.Main.GetCoin()
            this.Level.SetBlock(x, y, 0)
        }
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].BumpCheck(x, y);
        }
    }
    CheckForChange(context) {
        if (this.GotoLoseState) {
            context.ChangeState(new Game.TitleState(Math.floor(Math.random()*10)));
        }
        else {
            if (this.GotoMapState) {
                context.ChangeState(new Game.LevelState(this.LevelDifficulty += 1, Math.floor(Math.random()*2)));
            }
        }
    }
};

Game.LevelState.prototype = new Engine.GameState();