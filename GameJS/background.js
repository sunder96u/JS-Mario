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
        let range = this.Distance ? 4 : 6
        let offset = this.Distance ? 2 : 1
        let oh = Math.floor(Math.random() * range) + offset
        let h = Math.floor(Math.random() * range) + offset
        let h0 = 0
        let h1 = 0
        let s = 2
        for (let x = 0; x < this.Width; x++) {
            oh = h
            while (oh === h) {
                h = Math.floor(Math.random() * range) + offset
            }
            for (let y = 0; y < this.Height; y++) {
                h0 = (oh < h) ? oh : h
                h1 = (oh < h) ? oh : h
                s = 2
                if (y < h0) {
                    if (this.Distance) {
                        s = 2
                        if (y < 2) { s = y }
                        level.SetBlock(x, y, 4 + s * 8)
                    } else {
                        level.SetBlock(x, y, 5)
                    }
                } else if ( y === h0) {
                    s = (h0 === h) ? 0 : 2
                    s += this.Distance ? 2 : 0
                    level.SetBlock(x, y, s)
                } else if ( y === h1) {
                    s = (h0 === h) ? 1 : 0
                    s += this.Distance ? 2 : 0
                    level.SetBlock(x, y, s + 16)
                } else {
                    s = (y > h1) ? 1 : 0
                    if (h0 === oh) { s = 1 - s}
                    s += this.Distance ? 2 : 0
                    level.SetBlock(x, y, s + 8)
                }
            }
        }
    }
    GenerateTitle(level) {
        for (let x = 0; x < this.Width; x++) {
            for (let y = 0; y < this.Height; y++) {
                level.SetBlock(x, y, 16)
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