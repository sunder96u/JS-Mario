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

Engine.Sprite.prototype = new Engine.Drawable()

Engine.SpriteFont = class {
    constructor(strings, image, letterWidth, letterHeight, letters) {
        this.Image = image
        this.Letters = letters
        this.LetterWidth = letterWidth
        this.LetterHeight = letterHeight
        this.Strings = strings
    }
    Draw(context, camera) {
        for(let s = 0; s < this.Strings.length; s++) {
            let string = this.Strings[s]
            for (let i = 0; i < string.String.length; i++) {
                let code = string.String.charCodeAt(i)
                context.drawImage(this.Image, this.Letters[code].X, this.Letters[code].Y, this.LetterWidth, this.LetterHeight, string.X + this.LetterWidth * (i + 1), string.Y, this.LetterWidth, this.LetterHeight);
            }
        }
    }
}

Engine.SpriteFont.prototype = new Engine.Drawable()

Engine.FrameSprite = class {
    constructor() {
        this.FrameX = 0
        this.FrameY = 0
        this.FrameWidth = 0
        this.FrameHeight = 0
    }
    Draw(context, camera) {
        context.drawImage(this.Image, this.FrameX, this.FrameY, this.FrameWidth, this.FrameHeight, this.X - camera.X, this.Y - camera.Y, this.FrameWidth, this.FrameHeight)
    }
}

Engine.FrameSprite.prototype = new Engine.Sprite()

Engine.AnimationSequence = function(startRow, startColumn, endRow, endColumn) {
    this.StartRow = startRow
    this.StartColumn = startColumn
    this.EndRow = endRow
    this.EndColumn = endColumn
    
    //sometimes in an animated sprite, we want it to behave like a regular sprite (static)
    //this variable will keep it from wasting time updating animation when the sequence
    //is only a single frame long, for things like standing or pausing action
    this.SingleFrame = false
    
    if ((this.StartRow == this.EndRow) && (this.StartColumn == this.EndColumn)) {
        this.SingleFrame = true
    }
}

Engine.AnimatedSprite = class {
    constructor() {
        this.LastElapsed = 0
        this.FramesPerSecond = 1 / 20
        this.CurrentSequence = null
        this.Playing = false
        this.Looping = false
        this.Rows = 0
        this.Columns = 0

        //cheesy dictionary hack to make animation sequences more accessible
        this.Sequences = new Object()
    }
    Update(delta) {
        if (this.CurrentSequence.SingleFrame) {
            return
        }
        if (!this.Playing) {
            return
        }

        this.LastElapsed -= delta

        if (this.LastElapsed > 0) {
            return
        }

        this.LastElapsed = this.FramesPerSecond
        this.FrameX += this.FrameWidth

        //increment the frame
        if (this.FrameX > (this.Image.width - this.FrameWidth)) {
            this.FrameX = 0
            this.FrameY += this.FrameHeight

            if (this.FrameY > (this.Image.height - this.FrameHeight)) {
                this.FrameY = 0
            }
        }

        //check if it's at the end of the animation sequence
        let seqEnd = false
        if ((this.FrameX > (this.CurrentSequence.EndColumn * this.FrameWidth)) && (this.FrameY == (this.CurrentSequence.EndRow * this.FrameHeight))) {
            seqEnd = true
        } else if (this.FrameX == 0 && (this.FrameY > (this.CurrentSequence.EndRow * this.FrameHeight))) {
            seqEnd = true
        }

        //go back to the beginning if looping, otherwise stop playing
        if (seqEnd) {
            if (this.Looping) {
                this.FrameX = this.CurrentSequence.StartColumn * this.FrameWidth
                this.FrameY = this.CurrentSequence.StartRow * this.FrameHeight
            } else {
                this.Playing = false
            }
        }
    }
    PlaySequence(seqName, loop) {
        this.Playing = true
        this.Looping = loop
        this.CurrentSequence = this.Sequences["seq_" + seqName]
        this.FrameX = this.CurrentSequence.StartColumn * this.FrameWidth
        this.FrameY = this.CurrentSequence.StartRow * this.FrameHeight
    }
    StopLooping() {
        this.Looping = false
    }
    StopPlaying() {
        this.Playing = false
    }
    SetFrameWidth(width) {
        this.FrameWidth = width
        this.Rows = this.Image.width / this.FrameWidth
    }
    SetFrameHeight(height) {
        this.FrameHeight = height
        this.Columns = this.Image.height / this.FrameHeight
    }
    SetColumnCount(columnCount) {
        this.FrameWidth = this.Image.width / columnCount
        this.Columns = columnCount
    }
    SetRowCount(rowCount) {
        this.FrameHeight = this.Image.height / rowCount
        this.Rows = rowCount
    }
    AddExistingSequence(name, sequence) {
        this.Sequences["seq_" + name] = sequence
    }
    AddNewSequence(name, startRow, startColumn, endRow, endColumn) {
        this.Sequences["seq_" + name] = new Engine.AnimationSequence(startRow, startColumn, endRow, endColumn)
    }
    DeleteSequence(name) {
        if (this.Sequences["seq_" + name] != null) {
            delete this.Sequences["seq_" + name]
        }
    }
    ClearSequences() {
        delete this.Sequences
        this.Sequences = new Object()
    }
}

Engine.AnimatedSprite.prototype = new Engine.FrameSprite()