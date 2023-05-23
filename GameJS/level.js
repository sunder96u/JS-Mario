/* Created by Steven Underwood 2023 */

Game.Tile = {
    // where to place block
    BlockUpper: 1 << 0,
    BlockAll: 1 << 1,
    BlockLower: 1 << 2,
    Special: 1 << 3,
    Bumpable: 1 << 4,
    Breakable: 1 << 5,
    Animated: 1 << 6,
    Behaviors: [],
    // what behaviors

    LoadBehaviors: function() {
        let behavior = []
        for (let i = 0; i < 256; i++)
         {
            behavior[i] = 0
         }
         this.Behaviors = behavior
    }
}

Game.LevelType = {
    Title: 0,
    Level: 1
}

Game.Odds = {
    Straight: 0,
    Tubes: 1,
    Jump: 2
}

Game.Level = class {
    constructor(width, height) {
        this.Width = width
        this.Height = height
        this.ExitX = 10
        this.ExitY = 10

        this.Map = []
        this.Data = []
        this.SpriteTemplates = []

        for (let x = 0; x < this.Width; x++) {
            this.Map[x] = []
            this.Data[x] = []
            this.SpriteTemplates[x] = []
            for (let y = 0; y < this.Height; y++) {
                this.Map[x][y] = 0
                this.Data[x][y] = 0
                this.SpriteTemplates[x][y] = null
            }
        }
    }
    Update() {
        // update level
        for (let x = 0; x < this.Width; x++) {
            for (let y = 0; y < this.Height; y++) {
                if (this.Data[x][y] > 0) {
                    this.Data[x][y]--
                }
            }
        }
    }
    GetBlockCapped(x, y) {
        // max height of block
        if (x < 0) { x = 0 }
        if (y < 0) { y = 0 }
        if (x >= this.Width) { x = this.Width - 1 }
        if (y >= this.Height) { y = this.Height -1 }
        return this.Map[x][y]
    }
    GetBlock(x, y) {
        // create the block
        if (x < 0) { x = 0 }
        if (y < 0) { return 0 }
        if (x >= this.Width) { x = this.Width -1 }
        if (y >= this.Height) { y = this.Height -1 }
        return this.Map[x][y]
    }
    SetBlock(x, y, block) {
        // set the block
        if (x < 0) { return }
        if (y < 0) { return }
        if (x >= this.Width) { return }
        if (y >= this.Height) { return }
        this.Map[x][y] = block
        console.log(this.Map[x][y])
    }
    SetBlockData(x, y, data) {
        // give the block data
        if (x < 0) { return }
        if (y < 0) { return }
        if (x >= this.Width) { return }
        if (y >= this.Height) { return }
        this.Data[x][y] = data
    }
    IsBlocking(x, y, xa, ya) {
        // give the block a blocking value
        let block = this.GetBlock(x, y)
        let blocking = ((Game.Tile.behaviors[block & 0xff]) & Game.Tile.BlockAll) > 0
        blocking |= (ya > 0) && ((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.BlockUpper) > 0
        blocking |= (ya < 0) && ((Game.Tile.Behaviors[block & 0xff]) & Game.Tile.BlockLower) > 0
        return blocking
    }
    GetSpriteTemplate(x, y) {
        // Get the sprites for the level
        if (x < 0) { return null }
        if (y < 0) { return null }
        if (x >= this.Width) { return null }
        if (y >= this.Height) { return null }
        return this.SpriteTemplates[x][y]
    }
    SetSpriteTemplate(x, y, template) {
        // set the sprites for the level
        if (x < 0) { return }
        if (y < 0) { return }
        if (x >= this.Width) { return }
        if (y >= this.Height) { return }
        this.SpriteTemplates[x][y] = template

    }
}

Game.LevelGenerator = class {
    constructor(width, height) {
        this.Width = width
        this.Height = height
        this.Type = 0
    }
    CreateLevel(type) {
        // create the level
    }
    BuildZone() {

    }
    BuildJump() {

    }
    AddEnemy() {

    }
    BuildTubes() {

    }
    BuildStraight() {

    }
    Decorate() {

    }
    FixWalls() {

    }
    Blockify() {

    }
}

Game.LevelRender = class {
    constructor(level, width, height) {
        this.Width = width
        this.Height = height
        this.Level = level
        this.TilesY = ((height / 16) | 0 ) + 1
        this.Delta = 0
        this.Tick = 0
        this.AnimTime = 0
        this.Background = Game.SpriteCuts.GetLevelSheet()
    }
    Update(delta) {

    }
    Draw() {

    }
    DrawStatic() {

    }
    DrawDynamic() {

    }
}

Game.LevelRender.prototype = new Engine.Drawable()