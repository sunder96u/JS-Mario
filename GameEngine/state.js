/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

// Creates the Game state context, and changes the game state

Engine.GameStateContext = class {
    constructor(defaultState) {
        this.State = null // sets a new game state to null
        
        if (defaultState != null) {
            this.State = defaultState  // if gamestate is not null, changes to default state
            this.State.Enter()        // runs the gameState enter
        }
    }
    ChangeState(newState) {
        if (this.State != null) {
            this.State.Exit()
        }
        this.State = newState
        this.State.Enter()
    }
    Update(delta) {
        this.State.CheckForChange(this)
        this.State.Update(delta)
    }
    Draw(delta) {
        this.State.Draw(delta)
    }
}

Engine.GameState = class {
    constructor() {}
    Enter() {}
    Exit() {}
    Update(delta) {}
    Draw(context) {}
    CheckForChange(context) {}
}