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

    // gets the actual Node class of each div if the div is input and class is needed to change wall
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

    // Maze Generation
    randomGridGenerator() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                if (Math.random() > 0.7) {
                    this.changeToWall(this.board[i][j]);
                }
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

// Executes when the document is ready
$(document).ready(function() {
    let grid = new Grid($(".grid-ratio").val());
    grid.createGrid();
    
    // Event Listeners
    // Manual Maze Creation Mode
    gridEditor(grid);
    
    // Random Maze Generator
    // For the maze generators call the grid reset first (make the manual grid reset too)
    $(".random-maze-generator").click(function() {
        grid.clearGrid();
        grid.randomGridGenerator();
    });
    
    $(".clear-grid-button").click(function() {
        grid.clearGrid();
    });

    // Grid size selector when button is pressed if different
    $(".grid-size-button").click(function() {
        let gridRatio = $(".grid-ratio").val();
        if (gridRatio != grid.gridRatio) {
            $(".grid").remove();
            grid = new Grid(gridRatio);
            grid.createGrid();
            
            // Manual Maze Creation Mode
            gridEditor(grid);
        }
    });
});

// Make sure to set both the Node attributes and div element classes in the setters so they never misalign
// When making setters just make sure they all change class attributes and html classes

function gridEditor(grid) {
    $(".node").mousedown(function() {
        grid.changeToWall(grid.getNode(this));
    });
    // $(".node").mousedown(function() {
    //     $('.node').hover(function() {
    //         grid.changeToWall(this);
    //     })
    // });
}