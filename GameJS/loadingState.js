/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Game.LoadingState = class {
    constructor() {
        this.Images = [];
        this.ImagesLoaded = false;
        this.ScreenColor = 0;
        this.ColorDirection = 1;
        this.ImageIndex = 0;
        this.SoundIndex = 0;
    }
    Enter() {
        var i = 0;
        for (i = 0; i < 7; i++) {
            this.Images[i] = {};
        }

        this.Images[0].name = "background"
        this.Images[0].src = "GameAssets/bgsheet.png"
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

        Engine.Resources.AddImages(this.Images);
        Game.Tile.LoadBehaviors();
    }
    Exit() {
        delete this.Images;
    }
    Update(delta) {
        if (!this.ImagesLoaded) {
            this.ImagesLoaded = true;
            var i = 0;
            for (i = 0; i < this.Images.length; i++) {
                if (Engine.Resources.Images[this.Images[i].name].complete !== true) {
                    this.ImagesLoaded = false;
                    break;
                }
            }
        }

        this.ScreenColor += this.ColorDirection * 255 * delta;
        if (this.ScreenColor > 255) {
            this.ScreenColor = 255;
            this.ColorDirection = -1;
        } else if (this.ScreenColor < 0) {
            this.ScreenColor = 0;
            this.ColorDirection = 1;
        }
    }
    Draw(context) {
        if (!this.ImagesLoaded) {
            var color = parseInt(this.ScreenColor, 10);
            context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
            context.fillRect(0, 0, 640, 480);
        } else {
            context.fillStyle = "rgb(0, 0, 0)";
            context.fillRect(0, 0, 640, 480);
        }
    }
    CheckForChange(context) {
        if (this.ImagesLoaded) {
            //set up the global map state variable
            Game.GlobalMapState = new Game.LevelState(1, 0);

            context.ChangeState(new Game.TitleState(Math.floor(Math.random() * 10)));
            console.log(`loading titlestate`)
        }
    }
};

Game.LoadingState.prototype = new Engine.GameState();