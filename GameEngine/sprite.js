/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Engine.Sprite = class {
    constructor() {
        this.X = 0
        this.Y = 0
        this.Image = null
    }
    Draw(context, camera) {
        context.drawImage(this.Image, this.X - camera.X, this.Y - camera.Y)
    }
}

Engine.Sprite.prototype = new Engine.Draw()