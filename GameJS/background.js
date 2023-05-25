/* Created by Steven Underwood */

Game.Background = class {
    constructor(width, height, distance, type) {
        this.Width = width
        this.Height = height
        this.Distance = distance
        this.Type = type
    }
    SetValues(width, height, distance, type) {
        this.Width = width
        this.Height = height
        this.Distance = distance
        this.Type = type
    }
    CreateLevel() {
        let level = new Game.Level(this.Width, this.Height)
        switch (this.Type) {
            case Game.LevelType.Overworld:
                this.GenerateOverworld(level)
                break;
            case Game.LevelType.Underwold:
                this.GenerateUnderworld(level)
                break;
        }
        return level
    }
    GenerateOverworld(level) {
        var range = this.Distant ? 4 : 6;
        var offs = this.Distant ? 2 : 1;
        var oh = Math.floor(Math.random() * range) + offs;
        var h = Math.floor(Math.random() * range) + offs;

        var x = 0, y = 0, h0 = 0, h1 = 0, s = 2;
        for (x = 0; x < this.Width; x++) {
            oh = h;
            while (oh === h) {
                h = Math.floor(Math.random() * range) + offs;
            }

            for (y = 0; y < this.Height; y++) {
                h0 = (oh < h) ? oh : h;
                h1 = (oh < h) ? h : oh;
                s = 2;
                if (y < h0) {
                    if (this.Distant) {
                        s = 2;
                        if (y < 2) { s = y; }
                        level.SetBlock(x, y, 4 + s * 8);
                    } else {
                        level.SetBlock(x, y, 5);
                    }
                } else if (y === h0) {
                    s = h0 === h ? 0 : 1;
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s);
                } else if (y === h1) {
                    s = h0 === h ? 0 : 1;
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s + 16);
                } else {
                    s = (y > h1) ? 1 : 0;
                    if (h0 === oh) { s = 1 - s; }
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s + 8);
                }
            }
        }
    }
    GenerateUnderworld(level) {
        let x = 0, y = 0, t = 0, yy = 0;
        if (this.Distant) {
            for (x = 0; x < this.Width; x++) {
                for (y = 0; y < this.Height; y++) {
                    t = x % 2;
                    yy = y - 1;
                    
                    if (yy > 2 && yy < 5) {
                        yy = 2;
                    } else if (yy >= 5) {
                        yy -= 2;
                    }
                    
                    if (yy < 0) {
                        t = 0;
                        yy = 5;
                    } else if (yy > 4) {
                        t = 1;
                        yy = 5;
                    } else if (t < 1 && yy === 3) {
                        t = 0;
                        yy = 3;
                    } else if (t < 1 && yy > 0 && yy < 3) {
                        t = 0;
                        yy = 2;
                    }
                    
                    level.SetBlock(x, y, (1 + t + (yy + 4) * 8));
                }
            }
        } else {
            for (x = 0; x < this.Width; x++) {
                for (y = 0; y < this.Height; y++) {
                    t = x % 3;
                    yy = y - 1;
                    
                    if (yy > 2 && yy < 5) {
                        yy = 2;
                    } else if (yy >= 5) {
                        yy -= 2;
                    }
                    
                    if (yy < 0) {
                        t = 1;
                        yy = 5;
                    } else if (yy > 4) {
                        t = 2;
                        yy = 5;
                    } else if (t < 2 && yy === 4) {
                        t = 2;
                        yy = 4;
                    } else if (t < 2 && yy > 0 && yy < 4) {
                        t = 4;
                        yy = -3;
                    }
                    
                    level.SetBlock(x, y, (1 + t + (yy + 3) * 8));
                }
            }
        }
    }
}

Game.BackgroundRender = class {
    constructor(level, width, height, distance) {
        this.Level = level
        this.Width = width
        this.Height = height
        this.Distance = distance
        this.TilesY = ((height / 32) | 0) + 1

        this.Background = Game.SpriteCuts.GetBackgroundSheet()
    }
    Draw(context, camera) {
        let xCamera = camera.X / this.Distance
        let x = 0, y = 0, block = null, frame = null

        let xTileStart = (xCamera / 32) | 0
        let xTileEnd = (((xCamera + this.Width) / 32) | 0)

        for (x = xTileStart; x <= xTileEnd; x++) {
            for (y = 0; y < this.TilesY; y++) {
                block = this.Level.GetBlock(x, y) & 0xff
                frame = this.Background[block % 8][(block / 8) | 0]

                context.drawImage(Engine.Resources.Images["background"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 5) - xCamera) | 0, (y << 5) | 0, frame.Width, frame.Height)
            }
        }
    }
}

Game.BackgroundRender.prototype = new Engine.Drawable()