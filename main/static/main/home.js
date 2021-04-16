class Node {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.wall = false;
        this.start = false;
        this.end = false;
        this.div = $(`row-${this.row} column-${this.column}`);
    }
}

class Grid {
    constructor() {
        this.container = $(".grid");
        this.gridWidth = 1600;
        this.gridHeight = 800;
        this.rowNodes = 16;
        this.columnNodes = 32;
        this.board = [];
        this.start_node = null;
        this.end_node = null;
    }

    createGrid() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            let temporary_array = [];
            for (let j = 0; j < this.columnNodes; j++) {
                let node = new Node(i, j);
                temporary_array.push(node);
                this.container.append(`<div class='node row-${i}-column-${j}'></div>`);
            }
            this.board.push(temporary_array);
        }
        $(".node").width(this.gridWidth/this.columnNodes);
        $(".node").height(this.gridHeight/this.rowNodes);

        this.initialiseBoard();
    }

    initialiseBoard() {
        this.start_node = this.board[2][2];
        this.end_node = this.board[13][29];
        // Check if this is needed later
        this.start_node.start = true;
        this.end_node.end = true;
        this.setStart();
        this.setEnd();
    }

    setStart() {
        $(".row-2-column-2").addClass("start-node")
        // $(`row-${this.start_node.row}-column-${this.start_node.column}`).css("background-color", "black");
        // this.start_node.div.addClass('start-node');
    }

    setEnd() {
        $(".row-13-column-29").addClass("end-node")
        // this.end_node.div.addClass('end-node');
    }
}

// Check $(document).ready(function {}) is needed
let grid = new Grid();
grid.createGrid();
