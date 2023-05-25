/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Engine.Collideable = class {
    constructor(object, width, height, collisionEvent) {
        this.Base = obj
        this.X = object.X
        this.Y = object.Y
        this.Width = width
        this.Height = height

        if (collisionEvent != null) {
            this.CollisionEvent = collisionEvent
        } else {
            this.CollisionEvent = function () { }
        }
    }
    Update() {
        this.X = this.Base.X
        this.Y = this.Base.Y
    }
    CheckCollision(collision) {
        let left1 = this.X, left2 = collision.X
        let right1 = (this.X + this.Width), right2 = (collision.X + collision.Width)
        let top1 = this.Y, top2 = collision.Y
        let bottom1 = (this.Y + this.Height), bottom2 = collision.Y + collision.Height

        if (bottom1 < top2) {
            return;
        }
        if (top1 > bottom2) {
            return;
        }
        if (right1 < left2) {
            return;
        }
        if (left1 > right2) {
            return;
        }

        //collision, fire the events!
        this.CollisionEvent(collision)
        collision.CollisionEvent(this)
    }
};