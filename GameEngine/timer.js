/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Engine.GameTimer = class {
    constructor() {
        this.FramesPerSecond = 1000 / 30
        this.LastTime = 0
        this.IntervalFunction = null
        this.UpdateObject = null
    }
    Start() {
        this.LastTime = new Date().getTime()
        let self = this
        this.IntervalFunction = setInterval(function () { self.Tick()}, this.FramesPerSecond)
    }
    Tick() {
        if (this.UpdateObject != null) {
            let newTime = new Date().getTime()
            let delta = (newTime - this.LastTime) / 1000
            this.LastTime = newTime
            this.UpdateObject.Update(delta)
        }
    }
    Stop() {
        clearInterval(this.IntervalFunction)
    }
}