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
            case Game.LevelType.Title:
                this.GenerateTitle(level)
                break;
            case Game.LevelType.Level:
                this.GenerateLevel(level)
                break;
        }
        return level
    }
    GenerateLevel(level) {
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
    GenerateTitle(level) {
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
        let x = 0, y = 0, b = null, frame = null

        let xTileStart = (xCamera / 32) | 0
        let xTileEnd = (((xCamera + this.Width) / 32) | 0)

        for (x = xTileStart; x <= xTileEnd; x++) {
            for (y = 0; y < this.TilesY; y++) {
                b = this.Level.GetBlock(x, y) & 0xff
                frame = this.Background[b % 8][(b / 8) | 0]

                context.drawImage(Engine.Resources.Images["background"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 5) - xCamera) | 0, (y << 5) | 0, frame.Width, frame.Height)
            }
        }
    }
}

Game.BackgroundRender.prototype = new Engine.Drawable()