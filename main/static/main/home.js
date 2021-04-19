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
        this.container = $(".grid");
        this.gridWidth = 1600;
        this.gridHeight = 800;
        this.rowNodes = this.gridRatio * 8;
        this.columnNodes = this.gridRatio * 16;
        this.board = [];
        this.start_node = null;
        this.end_node = null;
    }

    createGrid() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            let temporary_array = [];
            for (let j = 0; j < this.columnNodes; j++) {
                this.container.append(`<div class='node row-${i}-column-${j}'></div>`);
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
        this.end_node = this.board[13][29];
        this.setStart();
        this.setEnd();
    }

    changeToWall(node) {
        if ($(node).hasClass("wall")) {
            $(node).removeClass('wall');
        } else {
            $(node).addClass('wall');
        }
    }

    // Setters for board attributes
    setWall(node) {
        node.wall = true;
        node.div.addClass("wall");
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

    // Maze Generation
    randomGridGenerator() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                if (Math.random() > 0.75) {
                    this.setWall(this.board[i][j]);
                }
            }
        }
    }
}

// Executes when the document is ready
$(document).ready(function() {
    let grid = new Grid($(".grid-ratio").val());
    grid.createGrid();

    // Event Listeners

    // Manual Maze Creation Mode
    $(".node").mousedown(function() {
        grid.changeToWall(this);
    });

    // Random Maze Generator
    // For the maze generators call the grid reset first (make the manual grid reset too)
    $(".random-maze-generator").click(function() {
        grid.randomGridGenerator();
    });

    // Grid size selector when button is pressed if different
    // $(".grid-ratio").on("input", function() {
    //     console.log(this.value);
    // });
});

// Make sure to set both the Node attributes and div element classes in the setters so they never misalign
// When making setters just make sure they all change class attributes and html classes
