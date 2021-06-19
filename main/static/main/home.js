import {Dijkstra} from './dijkstra.js';
import {Animations} from './animations.js';

class Node {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.wall = false;
        this.start = false;
        this.end = false;
        this.traversed = false;
        this.div = $(`.row-${this.row}-column-${this.column}`);
    }
}

class Grid {
    constructor(gridRatio, animator) {
        this.gridRatio = gridRatio;
        this.container = $(".main");
        this.gridWidth = 1600;
        this.gridHeight = 800;
        this.rowNodes = this.gridRatio * 8;
        this.columnNodes = this.gridRatio * 16;
        this.board = [];
        this.start_node = null;
        this.end_node = null;
        this.animator = new Animations();
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

        // Initialises the start and end of the board
        this.setStart(this.board[2][2]);
        this.setEnd(this.board[this.rowNodes-3][this.columnNodes-3]);
    }

    setStart(node) {
        this.start_node = node;
        this.animator.setStartAnimation(node);
    }

    setEnd(node) {
        this.end_node = node;
        this.animator.setEndAnimation(node);
    }

    getNode(node) {
        let [i, j] = node.className.match(/\d+/g);
        return this.board[i][j];
    }

    randomGridGenerator() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                if (Math.random() > 0.7) {
                    this.animator.changeToWall(this.board[i][j]);
                }
            }
        }
    }

    invertGrid() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                this.animator.changeToWall(this.board[i][j]);
            }
        }
    }

    clearGrid() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                this.animator.clearNode(this.board[i][j]);
            }
        }
    }
}

$(document).ready(function() {
    let grid = new Grid($(".grid-ratio").val());
    grid.createGrid();
    
    // Event Listeners
    gridEditor(grid);

    $(".dijkstra").click(function() {
        let dijkstra = new Dijkstra(grid.start_node, grid.end_node, grid.board);
    })
    
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
        grid.animator.changeToWall(grid.getNode(this));
        mouse_is_down = true;
    }).mouseup(function() {
        mouse_is_down = false;
    });

    $(".node").mouseenter(function() {
        if (mouse_is_down) {
            grid.animator.changeToWall(grid.getNode(this));
        }
    })
}