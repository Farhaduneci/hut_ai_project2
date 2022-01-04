function AiPlayer(mode, gameManager) {
    this.gameManager = gameManager;
    this.gameManagerClone = this.cloneGM(gameManager);
    mode == "miniMax" ? this.runMiniMax() : this.runAlphaBeta();
}

AiPlayer.prototype.cloneGM = function (gameManager) {
    // create a background manager to do the temporary tile moves on
    var bgm = new GameManager(this.gameManager.size, StubManager, StubManager, StubManager);

    // clone grid
    for (var x = 0; x < gameManager.grid.cells.length; x++) {
        for (var y = 0; y < gameManager.grid.cells[x].length; y++) {
            var cell = gameManager.grid.cells[x][y];

            // clone cell if exists
            if (cell) {
                cell = new Tile({ x: cell.x, y: cell.y }, cell.value);
            }

            bgm.grid.cells[x][y] = cell;
        }
    }

    return bgm;
}

// create a stub manager
var nullFunc = function () { return null; };
function StubManager() { }

StubManager.prototype.on = StubManager.prototype.clearGameState = StubManager.prototype.continueGame = StubManager.prototype.getGameState = StubManager.prototype.getBestScore = StubManager.prototype.setBestScore = StubManager.prototype.clearGameState = StubManager.prototype.setGameState = StubManager.prototype.actuate = StubManager.prototype.get = StubManager.prototype.set = nullFunc;

function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

AiPlayer.prototype.runMiniMax = function () {
    let bestMove = this.miniMax(this.gameManager.depth, true);
    console.log(bestMove);
    this.gameManager.move(bestMove.move);
}

AiPlayer.prototype.miniMax = function (depth, maximizingPlayer) {
    if (depth == 0 || !this.gameManagerClone.movesAvailable() || this.gameManagerClone.isGameTerminated()) {
        return { move: null, score: this.gameManagerClone.grid.evaluate() };
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        for (var i = 3; i >= 0; i--) {
            this.gameManagerClone.move(i);
            moveBestScore = Math.max(bestScore, this.miniMax(depth - 1, false).score);

            if (moveBestScore > bestScore) {
                bestScore = moveBestScore;
                bestMove = i;
            }
        }

        return { move: bestMove, score: bestScore };
    } else {
        let bestScore = Infinity;

        for (var i = 0; i < 4; i++) {
            this.gameManagerClone.move(i);
            moveBestScore = Math.min(bestScore, this.miniMax(depth - 1, true).score);

            if (moveBestScore < bestScore) {
                bestScore = moveBestScore;
                bestMove = i;
            }
        }

        return { move: bestMove, score: moveBestScore };
    }
}

AiPlayer.prototype.runAlphaBeta = function () {
}

AiPlayer.prototype.alphaBeta = function (depth, alpha, beta, maximizingPlayer) {

}
