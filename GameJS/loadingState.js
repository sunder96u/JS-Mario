/* Created by Steven Underwood 2023 */

Game.LoadingState = class {
    constructor() {
        this.Images = []
        this.ImagesLoaded = false
        this.ScreenColor = 0
        this.ColorDirection = 1
        this.ImageIndex = 0
    }
    Enter() {
        // enter the level, load images
        for (let i = 0; i < 7; i++) {
            this.Images[i] = {}
        }

        // set the name and src for each image and spritesheet
        this.Images[0].name = "background"
        this.Images[0].src = "GameAssets/titlebackgroundsheet.png"
        this.Images[1].name = "enemies"
        this.Images[1].src = "GameAssets/enemysheet.png"
        this.Images[2].name = "font"
        this.Images[2].src = "GameAssets/font.gif"
        this.Images[3].name = "map"
        this.Images[3].src = "GameAssets/mapsheet.png"
        this.Images[4].name = "character"
        this.Images[4].src = "GameAssets/smallmariosheet.png"
        this.Images[5].name = "title"
        this.Images[5].src = "GameAssets/title.gif"
        this.Images[6].name = "particles"
        this.Images[6].src = "GameAssets/particlesheet.png"

        Engine.Resources.AddImages(this.Images)
        
        Game.Tile.LoadBehaviors()

    }
    Exit() {
        // clear on exit
        delete this.Images
    }
    Update(delta) {
        // update images
        if (!this.ImagesLoaded) {
            this.ImagesLoaded = true
            for(let i = 0; i < this.Images.length; i++) {
                if (Engine.Resources.Images[this.Images[i].name].complete != true) {
                    this.ImagesLoaded = false
                    break
                }
            }
        }

        this.ScreenColor += this.ColorDirection * 255 * delta
        if (this.ScreenColor > 255) {
            this.ScreenColor = 255
            this.ColorDirection = -1
        } else if (this.ScreenColor < 0) {
            this.ScreenColor = 0
            this.ColorDirection = 1
        }
    }
    Draw(context) {
        if (!this.ImagesLoaded) {
            let color = parseInt(this.ScreenColor, 10)
            context.fillStyle = `rgb(${color}, ${color}, ${color})`
            context.fillRect(0, 0, 640, 480)
        } else {
            context.fillStyle = `rgb(0, 0, 0)`
            context.fillRect(0, 0, 640, 480)
        }
    }
    CheckForChange(context) {
        if (this.ImagesLoaded) {
            Game.GlobalMapState = new Game.MapState()

            context.ChangeState(new Game.TitleState())
        }
    }
};

Game.LoadingState.prototype = new Engine.GameState()