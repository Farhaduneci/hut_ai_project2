function Grid(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
        var row = cells[x] = [];

        for (var y = 0; y < this.size; y++) {
            row.push(null);
        }
    }

    return cells;
};

Grid.prototype.fromState = function (state) {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
        var row = cells[x] = [];

        for (var y = 0; y < this.size; y++) {
            var tile = state[x][y];
            row.push(tile ? new Tile(tile.position, tile.value) : null);
        }
    }

    return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
    var cells = this.availableCells();

    if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
    }
};

Grid.prototype.availableCells = function () {
    var cells = [];

    this.eachCell(function (x, y, tile) {
        if (!tile) {
            cells.push({ x: x, y: y });
        }
    });

    return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            callback(x, y, this.cells[x][y]);
        }
    }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
    return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
    return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
    return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
    if (this.withinBounds(cell)) {
        return this.cells[cell.x][cell.y];
    } else {
        return null;
    }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
    this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
    this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
    return position.x >= 0 && position.x < this.size &&
        position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
    var cellState = [];

    for (var x = 0; x < this.size; x++) {
        var row = cellState[x] = [];

        for (var y = 0; y < this.size; y++) {
            row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
        }
    }

    return {
        size: this.size,
        cells: cellState
    };
};

/* ------------------- Terminal Nodes Evaluation Function ------------------- */

Grid.prototype.evaluate = function () {
    return this.evaluateEmptyTiles() +
        (
            this.evaluateSmoothness() +
            this.evaluateMonotonicity()
        );
}

/* -------------------------------------------------------------------------- */
/*                             Heuristic Functions                             */
/* -------------------------------------------------------------------------- */

Grid.prototype.evaluateEmptyTiles = function () {
    let sum = 0;
    this.eachCell((_x, _y, tile) => tile ? sum += 1 : null);

    return sum;
}

Grid.prototype.evaluateSmoothness = function () {
    let sum = 0;
    this.eachCell((x, y, tile) => {
        let left = this.cellContent({ x: x - 1, y: y });
        let right = this.cellContent({ x: x + 1, y: y });
        let up = this.cellContent({ x: x, y: y - 1 });
        let down = this.cellContent({ x: x, y: y + 1 });

        if (left && right && tile) {
            sum += Math.abs(left.value - right.value);
        }

        if (up && down && tile) {
            sum += Math.abs(up.value - down.value);
        }
    });

    return sum;
}

Grid.prototype.evaluateMonotonicity = function () {
    let sum = 0;
    this.eachCell((x, y, tile) => {
        let left = this.cellContent({ x: x - 1, y: y });
        let right = this.cellContent({ x: x + 1, y: y });
        let up = this.cellContent({ x: x, y: y - 1 });
        let down = this.cellContent({ x: x, y: y + 1 });

        if (left && right && tile) {
            sum += Math.abs(left.value - tile.value) + Math.abs(right.value - tile.value);
        }

        if (up && down && tile) {
            sum += Math.abs(up.value - tile.value) + Math.abs(down.value - tile.value);
        }
    });

    return sum;
}
