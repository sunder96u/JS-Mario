/* Created by Steven Underwood 2023 */

Game.MapState = class {
    constructor() {
        this.camera = new Engine.Camera()
        this.MapImage = document.createElement("canvas")
        this.MapImage.width = 320
        this.MapImage.height = 240
        this.MapContext = this.MapImage.getContext("2d")
    }
}

Game.MapState.prototype = new Engine.GameState()