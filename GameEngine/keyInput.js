/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

// Creates keyinput events

Engine.Keys = {
    // Playable Keys
    A: 65,
    W: 87,
    D: 68,
    S: 83,
    Space: 5,
    Enter: 6,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40
};

Engine.KeyInput = {
    Pressed: new Array(),

    Initialize: function() {
        let self = this;
        document.onkeydown = (event) => { self.KeyDownEvent(event)}
        document.onkeyup = (event) => { self.KeyUpEvent(event)}
    },

    IsKeyDown: function(key) {
        if (this.Pressed[key] != null) {
            console.log(key)
            return this.Pressed[key] 
        }
        return false
    },

    KeyDownEvent: function(event) {
        this.Pressed[event.keyCode] = true
        console.log(`keys pressed`)
        this.PreventScrolling(event)
    },

    KeyUpEvent: function(event) {
        this.Pressed[event.keyCode] = false
        console.log(event)
        this.PreventScrolling(event)
    },

    PreventScrolling: function(event) {
        if(event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault()
        }
    }
}