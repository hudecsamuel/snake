interface Pos {
    x: number
    y: number
}

class Snake {
    baseLength: number
    tailLength: number
    cells: Array<Pos>

    constructor(tailLength: number = 5, cells: Array<Pos>) {
        this.tailLength = tailLength
        this.baseLength = tailLength
        this.cells = cells
    }

    resetLength() {
        this.tailLength = this.baseLength
    }

    addCell(cell: Pos) {
        this.cells.push(cell)
    }

}

interface GameConfig {
    cellCount: Pos,
    outerCell?: number
    innerCell?: number
    frameRate?: number
}

const DefaultConfig: GameConfig = {
    cellCount: {
        x: 40,
        y: 40
    },
    outerCell: 20,
    innerCell: 18,
    frameRate: 1000/15
}

class Game {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    snake: Snake
    private _cellCount: Pos
    private _outerCell: number
    private _innerCell: number
    private _frameRate: number
    private _xVelocity: -1 | 0 | 1 = 1
    private _yVelocity: -1 | 0 | 1 = 0
    private _interval: any
    private _apple: Pos

    get frameRate(): number {
        return this._frameRate
    }

    set frameRate(rate: number) {
        this._frameRate = rate
        this._interval = setInterval(this.run, this._frameRate)
    }

    constructor(snake: Snake = null, config: GameConfig = DefaultConfig) {
        let mergedConf = { ...DefaultConfig, ...config }

        this._frameRate = mergedConf.frameRate
        this._cellCount = mergedConf.cellCount
        this._outerCell = mergedConf.outerCell
        this._innerCell = mergedConf.innerCell

        if (snake === null) {
            let tailLength = 5
            let cells = this.initialCells(tailLength)
            this.snake = new Snake(tailLength, cells)
        } else {
            this.snake = snake
        }

        this.spawnApple()

        this.canvas = <HTMLCanvasElement>document.getElementById("game-view")
        this.canvas.width = this._cellCount.x * this._outerCell
        this.canvas.height = this._cellCount.y * this._outerCell
        this.ctx = this.canvas.getContext("2d")

        this.run = this.run.bind(this)
    }

    registerKeys() {
        this.keyPush = this.keyPush.bind(this)
        document.addEventListener("keydown", this.keyPush)
    }

    keyPush(evt) {
        switch (evt.keyCode) {
            case 37:
                this._xVelocity = -1
                this._yVelocity = 0
                break
            case 38:
                this._xVelocity = 0
                this._yVelocity = -1
                break
            case 39:
                this._xVelocity = 1
                this._yVelocity = 0
                break
            case 40:
                this._xVelocity = 0
                this._yVelocity = 1
                break
        }
    }

    initialCells(tailLength): Array<Pos> {
        let cells: Array<Pos> = []
        for (let i = 0; i < tailLength; i++) {
            cells.push({
                x: i + Math.floor(this._cellCount.x / 2),
                y: Math.floor(this._cellCount.y / 2)
            })
        }

        return cells
    }

    newCell() {
        let playerPos = this.snake.cells[this.snake.cells.length - 1]
        let newCell = {
            x: playerPos.x + this._xVelocity,
            y: playerPos.y + this._yVelocity
        }

        if (newCell.x < 0) {
            newCell.x = this._cellCount.x - 1
        }

        if (newCell.x > this._cellCount.x - 1) {
            newCell.x = 0
        }

        if (newCell.y < 0) {
            newCell.y = this._cellCount.y - 1
        }

        if (newCell.y > this._cellCount.y - 1) {
            newCell.y = 0
        }

        this.snake.addCell(newCell)
    }

    renderBackground() {
        this.ctx.fillStyle = "#452B11"
        this.ctx.fillRect(0, 0, this._cellCount.x * this._outerCell, this._cellCount.y * this._outerCell)
    }

    renderApple() {
        this.ctx.fillStyle = "#ffd113"
        this.ctx.fillRect(this._apple.x * this._outerCell, this._apple.y * this._outerCell, this._innerCell, this._innerCell)
    }

    renderSnake() {
        this.ctx.fillStyle = "#1F6A24"
        let cells = this.snake.cells
        for (let i = 0; i < cells.length; i++) {
            this.ctx.fillRect(cells[i].x * this._outerCell, cells[i].y * this._outerCell, this._innerCell, this._innerCell)

            if (cells[i].x === cells[cells.length - 1].x
                && cells[i].y === cells[cells.length - 1].y 
                && i !== cells.length - 1) {
                this.snake.resetLength()
                this.updateScore()
            }
        }

        while (this.snake.cells.length > this.snake.tailLength) {
            this.snake.cells.shift()
        }
    }

    updateScore() {
        const scoreCounter = document.getElementById("score")
        scoreCounter.innerHTML = (this.snake.tailLength - this.snake.baseLength).toString()
    }

    checkApple() {
        let cells = this.snake.cells
        if (this._apple.x === cells[cells.length - 1].x
            && this._apple.y === cells[cells.length - 1].y) {
            this.snake.tailLength += 1
            this.updateScore()
            this.spawnApple()
        }
    }

    spawnApple() {
        this._apple = {
            x: Math.floor(Math.random() * this._cellCount.x),
            y: Math.floor(Math.random() * this._cellCount.y)
        }
    }

    run() {
        console.log(this.snake.cells)
        // console.log("Game is running...")
        this.newCell()
        this.renderBackground()
        this.renderApple()
        this.renderSnake()
        this.checkApple()
    }

    init() {
        this.registerKeys()
        this.updateScore()
        this._interval = setInterval(this.run, this._frameRate)
    }
}


window.onload = function () {

    const game = new Game()
    game.init()
}
