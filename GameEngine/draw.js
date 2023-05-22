/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Engine.Draw = class {
    constructor() {
        this.ZOrder = 0
    }
    Draw(context) {}
}

Engine.Drawer = class {
    constructor() {
        this.Unsorted = true
        this.Objects = []
    }
    Add(object) {
        this.Objects.push(object)
        this.Unsorted = true
    }
    AddRange(objects) {
        this.Objects = this.Objects.concat(objects)
        this.Unsorted = true
    }
    Clear() {
        this.Objects.splice(0, this.Objects.length)
    }
    Contains(obj) {
        let i = this.Objects.length
        while (i--) {
            if (this.Objects[i] === obj) {
                return true
            }
        }
        return false
    }
    Remove(object) {
        let index = this.Objects.indexOf(object)
        this.Objects.splice(index, 1)
    }
    RemoveAt(index) {
        this.Objects.splice(index, 1)
    }
    RemoveRange(index, length) {
        this.Objects.splice(index, length)
    }
    RemoveList(items) {
        let i = 0, j = 0;
        for (j = 0; j < items.length; i++) {
            for (i = 0; i < this.Objects.length; i++) {
                if (this.Objects[i] === items[j]) {
                    this.Objects.splice(i, 1);
                    items.splice(j, 1);
                    j--;
                    break;
                }
            }
        }
    }
    Update(delta) {
        let i = 0;
		for (i = 0; i < this.Objects.length; i++) {
			if (this.Objects[i].Update) {
				this.Objects[i].Update(delta);
			}
		}
    }
    Draw(context, camera) {
        if (this.Unsorted) {
            this.Unsorted = false
            this.Objects.sort(function(x1,x2) { return x1.ZOrder - x2.ZOrder})
        }

        let i = 0
        for (i = 0; i < this.Objects.length; i++) {
            if (this.Objects[i].Draw) {
                this.Object[i].Draw(context, camera)
            }
        }
    }
}