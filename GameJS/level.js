/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Game.Tile = {
    // where to place block
    BlockUpper: 1 << 0,
    BlockAll: 1 << 1,
    BlockLower: 1 << 2,
    Special: 1 << 3,
    Bumpable: 1 << 4,
    Breakable: 1 << 5,
    PickUpable: 1 << 6,
    Animated: 1 << 7,
    Behaviors: [],
    // what behaviors

    LoadBehaviors: function() {
        let behavior = []

        behavior[0] = 0;
        behavior[1] = 20;
        behavior[2] = 28;
        behavior[3] = 0;
        behavior[4] = 130;
        behavior[5] = 130;
        behavior[6] = 130;
        behavior[7] = 130;
        behavior[8] = 2;
        behavior[9] = 2;
        behavior[10] = 2;
        behavior[11] = 2;
        behavior[12] = 2;
        behavior[13] = 0;
        behavior[14] = 138;
        behavior[15] = 0;
        behavior[16] = 162;
        behavior[17] = 146;
        behavior[18] = 154;
        behavior[19] = 162;
        behavior[20] = 146;
        behavior[21] = 146;
        behavior[22] = 154;
        behavior[23] = 146;
        behavior[24] = 2;
        behavior[25] = 0;
        behavior[26] = 2;
        behavior[27] = 2;
        behavior[28] = 2;
        behavior[29] = 0;
        behavior[30] = 2;
        behavior[31] = 0;
        behavior[32] = 192;
        behavior[33] = 192;
        behavior[34] = 192;
        behavior[35] = 192;
        behavior[36] = 0;
        behavior[37] = 0;
        behavior[38] = 0;
        behavior[39] = 0;
        behavior[40] = 2;
        behavior[41] = 2;
        behavior[42] = 0;
        behavior[43] = 0;
        behavior[44] = 0;
        behavior[45] = 0;
        behavior[46] = 2;
        behavior[47] = 0;
        behavior[48] = 0;
        behavior[49] = 0;
        behavior[50] = 0;
        behavior[51] = 0;
        behavior[52] = 0;
        behavior[53] = 0;
        behavior[54] = 0;
        behavior[55] = 0;
        behavior[56] = 2;
        behavior[57] = 2;
        
        let i = 0;
        for (i = 58; i < 128; i++) {
            behavior[i] = 0;
        }
        
        behavior[128] = 2;
        behavior[129] = 2;
        behavior[130] = 2;
        behavior[131] = 0;
        behavior[132] = 1;
        behavior[133] = 1;
        behavior[134] = 1;
        behavior[135] = 0;
        behavior[136] = 2;
        behavior[137] = 2;
        behavior[138] = 2;
        behavior[139] = 0;
        behavior[140] = 2;
        behavior[141] = 2;
        behavior[142] = 2;
        behavior[143] = 0;
        behavior[144] = 2;
        behavior[145] = 0;
        behavior[146] = 2;
        behavior[147] = 0;
        behavior[148] = 0;
        behavior[149] = 0;
        behavior[150] = 0;
        behavior[151] = 0;
        behavior[152] = 2;
        behavior[153] = 2;
        behavior[154] = 2;
        behavior[155] = 0;
        behavior[156] = 2;
        behavior[157] = 2;
        behavior[158] = 2;
        behavior[159] = 0;
        behavior[160] = 2;
        behavior[161] = 2;
        behavior[162] = 2;
        behavior[163] = 0;
        behavior[164] = 0;
        behavior[165] = 0;
        behavior[166] = 0;
        behavior[167] = 0;
        behavior[168] = 2;
        behavior[169] = 2;
        behavior[170] = 2;
        behavior[171] = 0;
        behavior[172] = 2;
        behavior[173] = 2;
        behavior[174] = 2;
        behavior[175] = 0;
        behavior[176] = 2;
        behavior[177] = 2;
        behavior[178] = 2;
        behavior[179] = 0;
        behavior[180] = 1;
        behavior[181] = 1;
        behavior[182] = 1;
        
        for (i = 183; i < 224; i++) {
            behavior[i] = 0;
        }
        
        behavior[224] = 1;
        behavior[225] = 1;
        behavior[226] = 1;
        
        for (i = 227; i < 256; i++) {
            behavior[i] = 0;
        }
        
         this.Behaviors = behavior
    }
}

Game.LevelType = {
    Overground: 0,
    Underground: 1,
};

Game.Odds = {
    Straight: 0,
    HillStraight: 1,
    Tubes: 2,
    Jump: 3,
};

Game.Level = class {
    constructor(width, height) {
        this.Width = width
        this.Height = height;
        this.ExitX = 10;
        this.ExitY = 10;

        this.Map = [];
        this.Data = [];
        this.SpriteTemplates = [];

        var x = 0, y = 0;
        for (x = 0; x < this.Width; x++) {
            this.Map[x] = [];
            this.Data[x] = [];
            this.SpriteTemplates[x] = [];

            for (y = 0; y < this.Height; y++) {
                this.Map[x][y] = 0;
                this.Data[x][y] = 0;
                this.SpriteTemplates[x][y] = null;
            }
        }
    }
    Update() {
        var x = 0, y = 0;
        for (x = 0; x < this.Width; x++) {
            for (y = 0; y < this.Height; y++) {
                if (this.Data[x][y] > 0) {
                    this.Data[x][y]--;
                }
            }
        }
    }
    GetBlockCapped(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    }
    GetBlock(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { return 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    }
    SetBlock(x, y, block) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.Map[x][y] = block;
    }
    SetBlockData(x, y, data) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.Data[x][y] = data;
    }
    IsBlocking(x, y, xa, ya) {
        var block = this.GetBlock(x, y);
        var blocking = ((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.BlockAll) > 0;
        blocking |= (ya > 0) && ((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.BlockUpper) > 0;
        blocking |= (ya < 0) && ((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.BlockLower) > 0;

        return blocking;
    }
    GetSpriteTemplate(x, y) {
        if (x < 0) { return null; }
        if (y < 0) { return null; }
        if (x >= this.Width) { return null; }
        if (y >= this.Height) { return null; }
        return this.SpriteTemplates[x][y];
    }
    SetSpriteTemplate(x, y, template) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.SpriteTemplates[x][y] = template;
    }
};

Game.LevelGenerator = class {
    constructor(width, height) {
        this.Width = 32000
        this.Height = height;
        this.Odds = [];
        this.TotalOdds = 0;
        this.Difficulty = 0;
        this.Type = 0;
    }
    CreateLevel(type, difficulty) {
        var i = 0, length = 0, floor = 0, x = 0, y = 0, ceiling = 0, run = 0, level = null;

        this.Type = type;
        this.Difficulty = difficulty;
        this.Odds[Game.Odds.Straight] = 20;
        this.Odds[Game.Odds.HillStraight] = 20 * difficulty;
        this.Odds[Game.Odds.Tubes] = 3 + difficulty;
        this.Odds[Game.Odds.Jump] = 4 * difficulty;

        if (this.Type !== Game.LevelType.Overground) {
            this.Odds[Game.Odds.HillStraight] = 0;
        }

        for (i = 0; i < this.Odds.length; i++) {
            if (this.Odds[i] < 0) {
                this.Odds[i] = 0;
            }
            this.TotalOdds += this.Odds[i];
            this.Odds[i] = this.TotalOdds - this.Odds[i];
        }

        level = new Game.Level(this.Width, this.Height);
        length += this.BuildStraight(level, 0, level.Width, true);
        while (length < level.Width - 64) {
            length += this.BuildZone(level, length, level.Width - length);
        }
        floor = this.Height - 1 - (Math.random() * 4) | 0;
        level.ExitX = length + 8;
        level.ExitY = floor;

        for (x = length; x < level.Width; x++) {
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 145);
                }
            }
        }

        if (type === Game.LevelType.Underground) {
            for (x = 0; x < level.Width; x++) {
                if (run-- <= 0 && x > 4) {
                    ceiling = (Math.random() * 4) | 0;
                    run = ((Math.random() * 4) | 0) + 4;
                }
                for (y = 0; y < level.Height; y++) {
                    if ((x > 4 && y <= ceiling) || x < 1) {
                        level.SetBlock(x, y, 1 + 9 * 16);
                    }
                }
            }
        }

        this.FixWalls(level);

        return level;
    }
    BuildZone(level, x, maxLength) {
        var t = (Math.random() * this.TotalOdds) | 0, type = 0, i = 0;
        for (i = 0; i < this.Odds.length; i++) {
            if (this.Odds[i] <= t) {
                type = i;
            }
        }

        switch (type) {
            case Game.Odds.Straight:
                return this.BuildStraight(level, x, maxLength, false);
            case Game.Odds.HillStraight:
                return this.BuildHillStraight(level, x, maxLength);
            case Game.Odds.Tubes:
                return this.BuildTubes(level, x, maxLength);
            case Game.Odds.Jump:
                return this.BuildJump(level, x, maxLength);
        }
        return 0;
    }
    BuildJump(level, xo, maxLength) {
        var js = ((Math.random() * 4) | 0) + 2, jl = ((Math.random() * 2) | 0) + 2, length = js * 2 + jl, x = 0, y = 0, hasStairs = ((Math.random() * 3) | 0) === 0, floor = this.Height - 1 - ((Math.random() * 4) | 0);

        for (x = xo; x < xo + length; x++) {
            if (x < xo + js || x > xo + length - js - 1) {
                for (y = 0; y < this.Height; y++) {
                    if (y >= floor) {
                        level.SetBlock(x, y, 1 + 9 * 16);
                    } else if (hasStairs) {
                        if (x < xo + js) {
                            if (y >= floor - (x - xo) + 1) {
                                level.SetBlock(x, y, 9);
                            }
                        } else {
                            if (y >= floor - ((xo + length) - x) + 2) {
                                level.SetBlock(x, y, 9);
                            }
                        }
                    }
                }
            }
        }

        return length;
    }
    BuildHillStraight(level, xo, maxLength) {
        var length = ((Math.random() * 10) | 0) + 10, floor = this.Height - 1 - (Math.random() * 4) | 0, x = 0, y = 0, h = floor, keepGoing = true, l = 0, xxo = 0, occupied = [], xx = 0, yy = 0;

        if (length > maxLength) {
            length = maxLength;
        }

        for (x = xo; x < xo + length; x++) {
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                }
            }
        }

        this.AddEnemyLine(level, xo + 1, xo + length - 1, floor - 1);

        while (keepGoing) {
            h = h - 2 - (Math.random() * 3) | 0;
            if (h <= 0) {
                keepGoing = false;
            } else {
                l = ((Math.random() * 5) | 0) + 3;
                xxo = ((Math.random() * (length - l - 2)) | 0) + xo + 1;

                if (occupied[xxo - xo] || occupied[xxo - xo + l] || occupied[xxo - xo - 1] || occupied[xxo - xo + l + 1]) {
                    keepGoing = false;
                } else {
                    occupied[xxo - xo] = true;
                    occupied[xxo - xo + l] = true;
                    this.AddEnemyLine(level, xxo, xxo + l, h - 1);
                    if (((Math.random() * 4) | 0) === 0) {
                        this.Decorate(level, xxo - 1, xxo + l + 1, h);
                        keepGoing = false;
                    }

                    for (x = xxo; x < xxo + l; x++) {
                        for (y = h; y < floor; y++) {
                            xx = 5;
                            yy = 9;
                            if (x === xxo) {
                                xx = 4;
                            }
                            if (x === xxo + l - 1) {
                                xx = 6;
                            }
                            if (y === h) {
                                yy = 8;
                            }

                            if (level.GetBlock(x, y) === 0) {
                                level.SetBlock(x, y, xx + yy * 16);
                            } else {
                                if (level.GetBlock(x, y) === (4 + 8 * 16)) {
                                    level.SetBlock(x, y, 4 + 11 * 16);
                                }
                                if (level.GetBlock(x, y) === (6 + 8 * 16)) {
                                    level.SetBlock(x, y, 6 + 11 * 16);
                                }
                            }
                        }
                    }
                }
            }
        }

        return length;
    }
    AddEnemyLine(level, x0, x1, y) {
        var x = 0, type = 0;
        for (x = x0; x < x1; x++) {
            if (((Math.random() * 35) | 0) < this.Difficulty + 1) {
                type = (Math.random() * 4) | 0;
                level.SetSpriteTemplate(x, y, new Game.SpriteTemplate(type, ((Math.random() * 35) | 0) < this.Difficulty));
            }
        }
    }
    BuildTubes(level, xo, maxLength) {
        var length = ((Math.random() * 10) | 0) + 5, floor = this.Height - 1 - (Math.random() * 4) | 0, xTube = xo + 1 + (Math.random() * 4) | 0, tubeHeight = floor - ((Math.random() * 2) | 0) - 2, x = 0, y = 0, xPic = 0;

        if (length > maxLength) {
            length = maxLength;
        }


        for (x = xo; x < xo + length; x++) {
            if (x > xTube + 1) {
                xTube += 3 + ((Math.random() * 4) | 0);
                tubeHeight = floor - ((Math.random() * 2) | 0) - 2;
            }
            if (xTube >= xo + length - 2) {
                xTube += 10;
            }

            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                } else {
                    if ((x === xTube || x === xTube + 1) && y >= tubeHeight) {
                        xPic = 10 + x - xTube;
                        if (y === tubeHeight) {
                            level.SetBlock(x, y, xPic);
                        } else {
                            level.SetBlock(x, y, xPic + 16);
                        }
                    }
                }
            }
        }

        return length;
    }
    BuildStraight(level, xo, maxLength, safe) {
        var length = ((Math.random() * 10) | 0) + 2, floor = this.Height - 1 - ((Math.random() * 4) | 0), x = 0, y = 0;
        if (safe) {
            length = 10 + ((Math.random() * 5) | 0);
        }
        if (length > maxLength) {
            length = maxLength;
        }

        for (x = xo; x < xo + length; x++) {
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                }
            }
        }

        if (!safe) {
            if (length > 5) {
                this.Decorate(level, xo, xo + length, floor);
            }
        }

        return length;
    }
    Decorate(level, x0, x1, floor) {
        if (floor < 1) {
            return;
        }

        var rocks = true, s = (Math.random() * 4) | 0, e = (Math.random() * 4) | 0, x = 0;

        this.AddEnemyLine(level, x0 + 1, x1 - 1, floor - 1);

        if (floor - 2 > 0) {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 1) {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++) {
                    level.SetBlock(x, floor - 2, 2 + 2 * 16);
                }
            }
        }

        s = (Math.random() * 4) | 0;
        e = (Math.random() * 4) | 0;

        if (floor - 4 > 0) {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 2) {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++) {
                    if (rocks) {
                        if (x !== x0 + 1 && x !== x1 - 2 && ((Math.random() * 3) | 0) === 0) {
                            if (((Math.random() * 4) | 0) === 0) {
                                level.SetBlock(x, floor - 4, 4 + 2 + 16);
                            } else {
                                level.SetBlock(x, floor - 4, 4 + 1 + 16);
                            }
                        } else if (((Math.random() * 4) | 0) === 0) {
                            if (((Math.random() * 4) | 0) === 0) {
                                level.SetBlock(x, floor - 4, 2 + 16);
                            } else {
                                level.SetBlock(x, floor - 4, 1 + 16);
                            }
                        } else {
                            level.SetBlock(x, floor - 4, 16);
                        }
                    }
                }
            }
        }
    }
    FixWalls(level) {
        var blockMap = [], x = 0, y = 0, xx = 0, yy = 0, blocks = 0;

        for (x = 0; x < this.Width + 1; x++) {
            blockMap[x] = [];

            for (y = 0; y < this.Height + 1; y++) {
                blocks = 0;
                for (xx = x - 1; xx < x + 1; xx++) {
                    for (yy = y - 1; yy < y + 1; yy++) {
                        if (level.GetBlockCapped(xx, yy) === (1 + 9 * 16)) {
                            blocks++;
                        }
                    }
                }
                blockMap[x][y] = blocks === 4;
            }
        }

        this.Blockify(level, blockMap, this.Width + 1, this.Height + 1);
    }
    Blockify(level, blocks, width, height) {
        var to = 0, b = [], x = 0, y = 0, xx = 0, yy = 0, i = 0, _xx = 0, _yy = 0;

        for (i = 0; i < 2; i++) {
            b[i] = [];
        }

        if (this.Type === Game.LevelType.Underground) {
            to = 12;
        }

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                for (xx = x; xx <= x + 1; xx++) {
                    for (yy = y; yy <= y + 1; yy++) {
                        _xx = xx;
                        _yy = yy;
                        if (_xx < 0) {
                            _xx = 0;
                        }
                        if (_yy < 0) {
                            _yy = 0;
                        }
                        if (_xx > width - 1) {
                            _xx = width - 1;
                        }
                        if (_yy > height - 1) {
                            _yy = height - 1;
                        }

                        b[xx - x][yy - y] = blocks[_xx][_yy];
                    }
                }

                if (b[0][0] === b[1][0] && b[0][1] === b[1][1]) {
                    if (b[0][0] === b[0][1]) {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 1 + 9 * 16 + to);
                        }
                    } else {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 1 + 10 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 1 + 8 * 16 + to);
                        }
                    }
                } else if (b[0][0] === b[0][1] && b[1][0] === b[1][1]) {
                    if (b[0][0]) {
                        level.SetBlock(x, y, 2 + 9 * 16 + to);
                    } else {
                        level.SetBlock(x, y, 9 * 16 + to);
                    }
                } else if (b[0][0] === b[1][1] && b[0][1] === b[1][0]) {
                    level.SetBlock(x, y, 1 + 9 * 16 + to);
                } else if (b[0][0] === b[1][0]) {
                    if (b[0][0]) {
                        if (b[0][1]) {
                            level.SetBlock(x, y, 3 + 10 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 3 + 11 * 16 + to);
                        }
                    } else {
                        if (b[0][1]) {
                            level.SetBlock(x, y, 2 + 8 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 8 * 16 + to);
                        }
                    }
                } else if (b[0][1] === b[1][1]) {
                    if (b[0][1]) {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 3 + 9 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 3 + 8 * 16 + to);
                        }
                    } else {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 2 + 10 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 10 * 16 + to);
                        }
                    }
                } else {
                    level.SetBlock(x, y, 1 + 16 * to);
                }
            }
        }
    }
};

Game.LevelRenderer = class {
    constructor(level, width, height) {
        this.Width = width
        this.Height = height;
        this.Level = level;
        this.TilesY = ((height / 16) | 0) + 1;
        this.Delta = 0;
        this.Tick = 0;
        this.Bounce = 0;
        this.AnimTime = 0;

        this.Background = Game.SpriteCuts.GetLevelSheet();
    }
    Update(delta) {
        this.AnimTime += delta;
        this.Tick = this.AnimTime | 0;
        this.Bounce += delta * 30;
        this.Delta = delta;
    }
    Draw(context, camera) {
        this.DrawStatic(context, camera);
        this.DrawDynamic(context, camera);
    }
    DrawStatic(context, camera) {
        var x = 0, y = 0, b = 0, frame = null, xTileStart = (camera.X / 16) | 0, xTileEnd = ((camera.X + this.Width) / 16) | 0;

        for (x = xTileStart; x < xTileEnd + 1; x++) {
            for (y = 0; y < this.TilesY; y++) {
                b = this.Level.GetBlock(x, y) & 0xff;
                if ((Game.Tile.Behaviors[b] & Game.Tile.Animated) === 0) {
                    frame = this.Background[b % 16][(b / 16) | 0];
                    context.drawImage(Engine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 4) - camera.X) | 0, (y << 4) | 0, frame.Width, frame.Height);
                }
            }
        }
    }
    DrawDynamic(context, camera) {
        var x = 0, y = 0, b = 0, animTime = 0, yo = 0, frame = null;
        for (x = (camera.X / 16) | 0; x <= ((camera.X + this.Width) / 16) | 0; x++) {
            for (y = (camera.Y / 16) | 0; y <= ((camera.Y + this.Height) / 16) | 0; y++) {
                b = this.Level.GetBlock(x, y);

                if (((Game.Tile.Behaviors[b & 0xff]) & Game.Tile.Animated) > 0) {
                    animTime = ((this.Bounce / 3) | 0) % 4;
                    if ((((b % 16) / 4) | 0) === 0 && ((b / 16) | 0) === 1) {
                        animTime = ((this.Bounce / 2 + (x + y) / 8) | 0) % 20;
                        if (animTime > 3) {
                            animTime = 0;
                        }
                    }
                    if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                        animTime = 2;
                    }
                    yo = 0;
                    if (x >= 0 && y >= 0 && x < this.Level.Width && y < this.Level.Height) {
                        yo = this.Level.Data[x][y];
                    }
                    if (yo > 0) {
                        yo = (Math.sin((yo - this.Delta) / 4 * Math.PI) * 8) | 0;
                    }
                    frame = this.Background[(((b % 16) / 4) | 0) * 4 + animTime][(b / 16) | 0];
                    context.drawImage(Engine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (x << 4) - camera.X, (y << 4) - camera.Y - yo, frame.Width, frame.Height);
                }
            }
        }
    }
    DrawExit0(context, camera, bar) {
        var y = 0, yh = 0, frame = null
        for (y = this.Level.ExitY - 8; y < this.Level.ExitY; y++) {
            frame = this.Background[12][y === this.Level.ExitY - 8 ? 4 : 5]
            context.drawImage(Engine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X - 16, (y << 4) - camera.Y, frame.Width, frame.Height)
        }

        if (bar) {
            yh = this.Level.ExitY * 16 - (3 * 16) - (Math.sin(this.AnimTime) * 3 * 16) - 8
            frame = this.Background[12][3]
            context.drawImage(Engine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X - 16, yh - camera.Y, frame.Width, frame.Height)
            frame = this.Background[13][3]
            context.drawImage(Engine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X, yh - camera.Y, frame.Width, frame.Height)
        }
    }
    DrawExit1(context, camera) {
        var y = 0, frame = null
        for (y = this.Level.ExitY - 8; y < this.Level.ExitY; y++) {
            frame = this.Background[13][y === this.Level.ExitY - 8 ? 4 : 5]
            context.drawImage(Engine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X + 16, (y << 4) - camera.Y, frame.Width, frame.Height)
        }
    }
};

Game.LevelRenderer.prototype = new Engine.Drawable()
