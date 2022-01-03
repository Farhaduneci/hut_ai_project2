function AiPlayer(mode, gameManager) {
    this.gameManager = gameManager;
    mode == "miniMax" ? this.runMiniMax() : this.runAlphaBeta();
}

AiPlayer.prototype.runMiniMax = function() {
    while (!this.gameManager.movesAvailable()) {
        bestMove = this.miniMax(0, true);
    }
}

AiPlayer.prototype.miniMax = function(depth, maximizingPlayer) {

}

AiPlayer.prototype.runAlphaBeta = function() {
    while (!this.gameManager.movesAvailable()) {
        bestMove = this.miniMax(0, true);
    }
}

AiPlayer.prototype.alphaBeta = function(depth, alpha, beta, maximizingPlayer) {

}
