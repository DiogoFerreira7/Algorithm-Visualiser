class Node {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.wall = false;
        this.start = false;
        this.end = false;
        this.div = $(`.row-${this.row}-column-${this.column}`);
    }
}

class Grid {
    constructor(gridRatio) {
        this.gridRatio = gridRatio;
        this.container = $(".main");
        this.gridWidth = 1600;
        this.gridHeight = 800;
        this.rowNodes = this.gridRatio * 8;
        this.columnNodes = this.gridRatio * 16;
        this.board = [];
        this.start_node = null;
        this.end_node = null;
    }

    createGrid() {
        this.container.append("<div class='grid'></div>")
        for (let i = 0; i < this.rowNodes; i++ ) {
            let temporary_array = [];
            for (let j = 0; j < this.columnNodes; j++) {
                $(".grid").append(`<div class='node row-${i}-column-${j}'></div>`);
                let node = new Node(i, j);
                temporary_array.push(node);
            }
            this.board.push(temporary_array);
        }
        $(".node").width(this.gridWidth/this.columnNodes);
        $(".node").height(this.gridHeight/this.rowNodes);

        this.initialiseBoard();
    }

    initialiseBoard() {
        this.start_node = this.board[2][2];
        this.end_node = this.board[this.rowNodes-3][this.columnNodes-3];
        this.setStart();
        this.setEnd();
    }

    getNode(node) {
        let [i, j] = node.className.match(/\d+/g);
        return this.board[i][j];
    }

    changeToWall(node) {
        if (node.wall == true) {
            node.wall = false;
            node.div.removeClass("wall");
        } else {
            node.wall = true;
            node.div.addClass("wall");
        }
    }

    // Change setStart and setEnd later to have a given node passed in after dragging works
    setStart() {
        this.start_node.start = true;
        this.start_node.div.addClass("start-node");
    }

    setEnd() {
        this.end_node.end = true;
        this.end_node.div.addClass("end-node");
    }

    randomGridGenerator() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                if (Math.random() > 0.7) {
                    this.changeToWall(this.board[i][j]);
                }
            }
        }
    }

    invertGrid() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                this.changeToWall(this.board[i][j]);
            }
        }
    }

    clearGrid() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                this.clearNode(this.board[i][j]);
            }
        }
    }

    clearNode(node) {
        node.wall = false;
        node.div.removeClass("wall");
    }
}

$(document).ready(function() {
    let grid = new Grid($(".grid-ratio").val());
    grid.createGrid();
    
    // Event Listeners
    gridEditor(grid);
    
    $(".random-maze-generator").click(function() {
        grid.clearGrid();
        grid.randomGridGenerator();
    });

    $(".invert-grid").click(function() {
        grid.invertGrid();
    });

    $(".clear-grid-button").click(function() {
        grid.clearGrid();
    });

    $(".grid-size-button").click(function() {
        let gridRatio = $(".grid-ratio").val();
        if (gridRatio != grid.gridRatio) {
            $(".grid").remove();
            grid = new Grid(gridRatio);
            grid.createGrid();
            
            gridEditor(grid);
        }
    });
});

function gridEditor(grid) {
    let mouse_is_down = false
    $(".node").mousedown(function() {
        grid.changeToWall(grid.getNode(this));
        mouse_is_down = true;
    }).mouseup(function() {
        mouse_is_down = false;
    });

    $(".node").mouseenter(function() {
        if (mouse_is_down) {
            grid.changeToWall(grid.getNode(this));
        }
    })
}