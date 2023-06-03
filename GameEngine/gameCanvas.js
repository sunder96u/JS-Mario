/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Engine.GameCanvas = class {
    constructor() {
        this.Canvas = null
        this.Context2D = null
        this.BackBuffer = null
        this.BackBufferContext2D = null
    }
    Initialize(canvasId, resWidth, resHeight) {
        this.Canvas = document.getElementById("canvas")
        this.Context2D = this.Canvas.getContext("2d") // gets the canvas context
        this.Canvas.width = resWidth
        this.Canvas.height = resHeight
        this.BackBuffer = document.createElement("canvas") // creates a second canvas as a backbuffer
        this.BackBuffer.width = resWidth // sets backbuffer width to canvas width
        this.BackBuffer.height = resHeight // sets backbuffer height to canvas height
        this.BackBufferContext2D = this.BackBuffer.getContext("2d") // gets the backbuffer context
    }
    BeginDraw() {
        this.BackBufferContext2D.clearRect(0, 0, this.BackBuffer.width, this.BackBuffer.height) // clears the backbuffer
        this.Context2D.clearRect(0, 0, this.Canvas.width, this.Canvas.height) // clears the canvas
    }
    EndDraw() {
        this.Context2D.drawImage(this.BackBuffer, 0, 0, this.BackBuffer.width, this.BackBuffer.height, 0, 0, this.Canvas.width, this.Canvas.height) // draws the backbuffer and canvas
    }
}
