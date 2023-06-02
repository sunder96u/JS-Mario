/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Game.Background = class {
    constructor(width, height, distant, type) {
        this.Width = width
        this.Height = height
        this.Distant = distant
        this.Type = type
    }
    SetValues(width, height, distant, type) {
        this.Width = width
        this.Height = height
        this.Distant = distant
        this.Type = type
    }
    CreateLevel() {
        var level = new Game.Level(this.Width, this.Height);
        switch (this.Type) {
            case Game.LevelType.Overground:
                this.GenerateOverground(level);
                break;
            case Game.LevelType.Underground:
                this.GenerateUnderground(level);
                break;
        }
        return level
    }
    GenerateOverground(level) {
        var range = this.Distant ? 4 : 6
        var offs = this.Distant ? 2 : 1
        var oh = Math.floor(Math.random() * range) + offs
        var h = Math.floor(Math.random() * range) + offs

        var x = 0, y = 0, h0 = 0, h1 = 0, s = 2
        for (x = 0; x < this.Width; x++) {
            oh = h
            while (oh === h) {
                h = Math.floor(Math.random() * range) + offs
            }

            for (y = 0; y < this.Height; y++) {
                h0 = (oh < h) ? oh : h
                h1 = (oh < h) ? h : oh
                s = 2
                if (y < h0) {
                    if (this.Distant) {
                        s = 2
                        if (y < 2) { s = y; }
                        level.SetBlock(x, y, 4 + s * 8)
                    } else {
                        level.SetBlock(x, y, 5)
                    }
                } else if (y === h0) {
                    s = h0 === h ? 0 : 1
                    s += this.Distant ? 2 : 0
                    level.SetBlock(x, y, s)
                } else if (y === h1) {
                    s = h0 === h ? 0 : 1
                    s += this.Distant ? 2 : 0
                    level.SetBlock(x, y, s + 16)
                } else {
                    s = (y > h1) ? 1 : 0
                    if (h0 === oh) { s = 1 - s }
                    s += this.Distant ? 2 : 0
                    level.SetBlock(x, y, s + 8)
                }
            }
        }
    }
    GenerateUnderground(level) {
        var x = 0, y = 0, t = 0, yy = 0
        if (this.Distant) {
            var tt = 0
            for (x = 0; x < this.Width; x++) {
                if (Math.random() < 0.75) { tt = 1 - tt; }

                for (y = 0; y < this.Height; y++) {
                    t = tt
                    yy = y - 2

                    if (yy < 0 || yy > 4) {
                        yy = 2
                        t = 0
                    }
                    level.SetBlock(x, y, (4 + t + (3 + yy) * 8))
                }
            }
        } else {
            for (x = 0; x < this.Width; x++) {
                for (y = 0; y < this.Height; y++) {
                    t = x % 2
                    yy = y - 1
                    if (yy < 0 || yy > 7) {
                        yy = 7
                        t = 0
                    }
                    if (t === 0 && yy > 1 && yy < 5) {
                        t = -1
                        yy = 0
                    }

                    level.SetBlock(x, y, (6 + t + yy * 8))
                }
            }
        }
    }
};

Game.BackgroundRender = class {
    constructor(level, width, height, distance) {
        this.Level = level
        this.Width = width
        this.Distance = distance
        this.TilesY = ((height / 32) | 0) + 1

        this.Background = Game.SpriteCuts.GetBackgroundSheet()
    }
    Draw(context, camera) {
        var xCam = camera.X / this.Distance
        var x = 0, y = 0, b = null, frame = null

        //the OR truncates the decimal, quicker than Math.floor
        var xTileStart = (xCam / 32) | 0
        //the +1 makes sure the right edge tiles get drawn
        var xTileEnd = (((xCam + this.Width) / 32) | 0)

        for (x = xTileStart; x <= xTileEnd; x++) {
            for (y = 0; y < this.TilesY; y++) {
                b = this.Level.GetBlock(x, y) & 0xff
                frame = this.Background[b % 8][(b / 8) | 0]

                //bitshifting by five is the same as multiplying by 32
                context.drawImage(Engine.Resources.Images["background"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 5) - xCam) | 0, (y << 5) | 0, frame.Width, frame.Height)
            }
        }
    }
};

Game.BackgroundRender.prototype = new Engine.Drawable()