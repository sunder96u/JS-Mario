/* Created using https://openhtml5games.github.io/games-mirror/dist/mariohtml5/main.html for game engine constructors
    code by Steven Underwood 2023
*/

Engine.Resources = {
    Images: {}, //sets Images to an empty array

    Destroy: function() {
        delete this.Images // clears the Images
        return this
    },

    AddImage: function(name, src) {
        let tempImage = new Image()
        this.Images(name) = tempImage
        tempImage.src = src
        return this
    },

    AddImages: function(array) {
        array.forEach((image) => {
            let tempImage = new Image()
            this.Images[image.name] = tempImage
            tempImage.src = image.src
        })
        return this
    },

    ClearImages: function() {
        delete this.Images
        this.Images = new Object()
        return this
    },

    RemoveImage: function(name) {
        delete this.Images[name]
        return this
    }

}