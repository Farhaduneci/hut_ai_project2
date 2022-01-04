function AiPlayer(mode, gameManager) {
    this.gameManager = gameManager;
    this.gameManagerClone = Object.assign({}, gameManager);
    this.tempGrid = new Grid(this.gameManager.grid);
    mode == "miniMax" ? this.runMiniMax() : this.runAlphaBeta();
}

AiPlayer.prototype.runMiniMax = function () {
    // while (this.gameManager.movesAvailable || this.gameManager.isGameTerminated()) {
    //     bestMove = this.miniMax(5, true).move;



    // }

    console.log(
        this.tempGrid.move(0)
    );
}

AiPlayer.prototype.miniMax = function (depth, maximizingPlayer) {
    if (depth == 0 || !this.gameManager.movesAvailable() || this.gameManager.isGameTerminated())
    return { move: null, score: this.gameManager.grid.evaluate() };

    if(maximizingPlayer)  {
        let bestScore = -Infinity;

        for (var i = 0; i < 4; i++) {
            this.tempGrid.move(i);
            bestMove = i;
            bestScore = Math.max(bestScore, this.miniMax(depth - 1, false).score);
        }

        return { move: -1, score: bestScore };
    }

}

AiPlayer.prototype.runAlphaBeta = function () {
    while (!this.gameManager.movesAvailable()) {
        bestMove = this.miniMax(0, true);
    }
}

AiPlayer.prototype.alphaBeta = function (depth, alpha, beta, maximizingPlayer) {

}
