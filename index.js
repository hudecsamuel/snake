var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Snake = (function () {
    function Snake(tailLength, cells) {
        if (tailLength === void 0) { tailLength = 5; }
        this.tailLength = tailLength;
        this.baseLength = tailLength;
        this.cells = cells;
    }
    Snake.prototype.resetLength = function () {
        this.tailLength = this.baseLength;
    };
    Snake.prototype.addCell = function (cell) {
        this.cells.push(cell);
    };
    return Snake;
}());
var DefaultConfig = {
    cellCount: {
        x: 40,
        y: 40
    },
    outerCell: 20,
    innerCell: 18,
    frameRate: 1000 / 15
};
var Game = (function () {
    function Game(snake, config) {
        if (snake === void 0) { snake = null; }
        if (config === void 0) { config = DefaultConfig; }
        this._xVelocity = 1;
        this._yVelocity = 0;
        var mergedConf = __assign({}, DefaultConfig, config);
        this._frameRate = mergedConf.frameRate;
        this._cellCount = mergedConf.cellCount;
        this._outerCell = mergedConf.outerCell;
        this._innerCell = mergedConf.innerCell;
        if (snake === null) {
            var tailLength = 5;
            var cells = this.initialCells(tailLength);
            this.snake = new Snake(tailLength, cells);
        }
        else {
            this.snake = snake;
        }
        this.spawnApple();
        this.canvas = document.getElementById("game-view");
        this.canvas.width = this._cellCount.x * this._outerCell;
        this.canvas.height = this._cellCount.y * this._outerCell;
        this.ctx = this.canvas.getContext("2d");
        this.run = this.run.bind(this);
    }
    Object.defineProperty(Game.prototype, "frameRate", {
        get: function () {
            return this._frameRate;
        },
        set: function (rate) {
            this._frameRate = rate;
            this._interval = setInterval(this.run, this._frameRate);
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.registerKeys = function () {
        this.keyPush = this.keyPush.bind(this);
        document.addEventListener("keydown", this.keyPush);
    };
    Game.prototype.keyPush = function (evt) {
        switch (evt.keyCode) {
            case 37:
                this._xVelocity = -1;
                this._yVelocity = 0;
                break;
            case 38:
                this._xVelocity = 0;
                this._yVelocity = -1;
                break;
            case 39:
                this._xVelocity = 1;
                this._yVelocity = 0;
                break;
            case 40:
                this._xVelocity = 0;
                this._yVelocity = 1;
                break;
        }
    };
    Game.prototype.initialCells = function (tailLength) {
        var cells = [];
        for (var i = 0; i < tailLength; i++) {
            cells.push({
                x: i + Math.floor(this._cellCount.x / 2),
                y: Math.floor(this._cellCount.y / 2)
            });
        }
        return cells;
    };
    Game.prototype.newCell = function () {
        var playerPos = this.snake.cells[this.snake.cells.length - 1];
        var newCell = {
            x: playerPos.x + this._xVelocity,
            y: playerPos.y + this._yVelocity
        };
        if (newCell.x < 0) {
            newCell.x = this._cellCount.x - 1;
        }
        if (newCell.x > this._cellCount.x - 1) {
            newCell.x = 0;
        }
        if (newCell.y < 0) {
            newCell.y = this._cellCount.y - 1;
        }
        if (newCell.y > this._cellCount.y - 1) {
            newCell.y = 0;
        }
        this.snake.addCell(newCell);
    };
    Game.prototype.renderBackground = function () {
        this.ctx.fillStyle = "#452B11";
        this.ctx.fillRect(0, 0, this._cellCount.x * this._outerCell, this._cellCount.y * this._outerCell);
    };
    Game.prototype.renderApple = function () {
        this.ctx.fillStyle = "#ffd113";
        this.ctx.fillRect(this._apple.x * this._outerCell, this._apple.y * this._outerCell, this._innerCell, this._innerCell);
    };
    Game.prototype.renderSnake = function () {
        this.ctx.fillStyle = "#1F6A24";
        var cells = this.snake.cells;
        for (var i = 0; i < cells.length; i++) {
            this.ctx.fillRect(cells[i].x * this._outerCell, cells[i].y * this._outerCell, this._innerCell, this._innerCell);
            if (cells[i].x === cells[cells.length - 1].x
                && cells[i].y === cells[cells.length - 1].y
                && i !== cells.length - 1) {
                this.snake.resetLength();
                this.updateScore();
            }
        }
        while (this.snake.cells.length > this.snake.tailLength) {
            this.snake.cells.shift();
        }
    };
    Game.prototype.updateScore = function () {
        var scoreCounter = document.getElementById("score");
        scoreCounter.innerHTML = (this.snake.tailLength - this.snake.baseLength).toString();
    };
    Game.prototype.checkApple = function () {
        var cells = this.snake.cells;
        if (this._apple.x === cells[cells.length - 1].x
            && this._apple.y === cells[cells.length - 1].y) {
            this.snake.tailLength += 1;
            this.updateScore();
            this.spawnApple();
        }
    };
    Game.prototype.spawnApple = function () {
        this._apple = {
            x: Math.floor(Math.random() * this._cellCount.x),
            y: Math.floor(Math.random() * this._cellCount.y)
        };
    };
    Game.prototype.run = function () {
        console.log(this.snake.cells);
        // console.log("Game is running...")
        this.newCell();
        this.renderBackground();
        this.renderApple();
        this.renderSnake();
        this.checkApple();
    };
    Game.prototype.init = function () {
        this.registerKeys();
        this.updateScore();
        this._interval = setInterval(this.run, this._frameRate);
    };
    return Game;
}());
window.onload = function () {
    var game = new Game();
    game.init();
};
//# sourceMappingURL=index.js.map