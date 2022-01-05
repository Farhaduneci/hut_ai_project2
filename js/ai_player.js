function AiPlayer(mode, gameManager, lastMovement) {
    this.gameManager = gameManager;
    this.gameManagerClone = this.cloneGM(gameManager);

    return mode == "miniMax"
        ? this.runMiniMax(lastMovement)
        : this.runAlphaBeta(lastMovement);
}

/* -------------------------------------------------------------------------- */
/*                             Mini-Max Functions                             */
/* -------------------------------------------------------------------------- */

AiPlayer.prototype.runMiniMax = function (lastMovement) {
    // Determine the best move and return if this choice moved tiles or not
    let bestMove = this.miniMax(this.gameManager.depth, true, lastMovement);
    let moved = this.gameManager.move(bestMove.move);

    let blockedMoves = new Array();

    if (lastMovement && !moved) {
        blockedMoves = lastMovement.blockedMoves.indexOf(bestMove.move) === -1
            ? lastMovement.blockedMoves.concat(bestMove.move)
            : blockedMoves;
    }

    return {
        moved,
        bestMove,
        blockedMoves
    };
}

AiPlayer.prototype.miniMax = function (depth, maximizingPlayer, lastMovement) {
    if (depth == 0 || !this.gameManagerClone.movesAvailable() || this.gameManagerClone.isGameTerminated()) {
        return { move: null, score: this.gameManagerClone.grid.evaluate() };
    }

    let validMoves = [0, 1, 2, 3];

    if (lastMovement && !lastMovement.moved) {
        validMoves = arrayDifference(validMoves, lastMovement.blockedMoves);
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        validMoves.forEach(movement => {
            this.gameManagerClone.move(movement);
            moveBestScore = Math.max(bestScore, this.miniMax(depth - 1, false).score);

            if (moveBestScore > bestScore) {
                bestScore = moveBestScore;
                bestMove = movement;
            }
        });

        return { move: bestMove, score: bestScore };
    } else {
        let bestScore = Infinity;

        validMoves.forEach(movement => {
            this.gameManagerClone.move(movement);
            moveBestScore = Math.min(bestScore, this.miniMax(depth - 1, true).score);

            if (moveBestScore < bestScore) {
                bestScore = moveBestScore;
                bestMove = movement;
            }
        });

        return { move: bestMove, score: moveBestScore };
    }
}

/* -------------------------------------------------------------------------- */
/*                            Alpha-Beta Functions                            */
/* -------------------------------------------------------------------------- */

AiPlayer.prototype.runAlphaBeta = function () {
}

AiPlayer.prototype.alphaBeta = function (depth, alpha, beta, maximizingPlayer) {

}

/* ---------------------------- Helper Functions ---------------------------- */

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

StubManager.prototype.clearGameState =
    StubManager.prototype.clearGameState =
    StubManager.prototype.continueGame =
    StubManager.prototype.getGameState =
    StubManager.prototype.getBestScore =
    StubManager.prototype.setBestScore =
    StubManager.prototype.setGameState =
    StubManager.prototype.actuate =
    StubManager.prototype.set =
    StubManager.prototype.get =
    StubManager.prototype.on = nullFunc;

function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

function arrayDifference(first, second) {
    return first.filter(x => !second.includes(x));
}
