import {Animations} from './animations.js';
import {Dijkstra} from './algorithms/dijkstra.js';
import {BFS} from './algorithms/bfs.js';


class Node {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.wall = false;
        this.start = false;
        this.end = false;
        this.traversed = false;
        this.path = false;
        this.neighbours = [];
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
        this.initialiseGrid();
    }

    initialiseGrid() {
        this.setStart(this.board[2][2]);
        this.setEnd(this.board[this.rowNodes-3][this.columnNodes-3]);
        

        // Gets the neighbours for all of the grid elements
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                this.getNeighbours(this.board[i][j]);
            }
        }
    }

    setStart(newNode, originalNode = null) {
        if (originalNode) {
            this.animator.removeStartAnimation(originalNode);
        }

        // set new grid class start node to the new node
        this.start_node = newNode;
        this.animator.setStartAnimation(newNode);
    }

    setEnd(newNode, originalNode = null) {
        if (originalNode) {
            this.animator.removeEndAnimation(originalNode);
        }

        this.end_node = newNode;
        this.animator.setEndAnimation(newNode);
    }

    getNode(node) {
        let [i, j] = node.className.match(/\d+/g);
        return this.board[i][j];
    }

    getNeighbours(node) {
        if (node.row != 0) {
            let nodeTop = this.board[node.row-1][node.column];
                node.neighbours.push(nodeTop);
        }
        if (node.column != (this.columnNodes - 1)) {
            let nodeRight = this.board[node.row][node.column+1];
                node.neighbours.push(nodeRight);
        }
        if (node.row != (this.rowNodes - 1)) {
            let nodeBottom = this.board[node.row+1][node.column];
                node.neighbours.push(nodeBottom);
        }
        if (node.column != 0) {
            let nodeLeft = this.board[node.row][node.column-1];
                node.neighbours.push(nodeLeft);
        }
    }

    randomGridGenerator() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                if (Math.random() > 0.7) {
                    if (this.board[i][j].end != true) {
                        this.animator.changeToWall(this.board[i][j]);
                    }
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
                let node = this.board[i][j];
                this.animator.clearNode(node);
                this.animator.removeTraversed(node);
                if (node.path) {
                    this.animator.removePath(node);
                }
            }
        }
    }

    clearPath() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                let node = this.board[i][j];
                this.animator.removeTraversed(node);
                if (node.path) {
                    this.animator.removePath(node);
                }
            }
        }
    }
}

$(document).ready(function() {
    // Grid Initialisation
    let grid = new Grid($(".grid-ratio").val());
    grid.createGrid();
    
    // Mouse Event Listeners
    gridEditor(grid);

    // Algorithms
    $(".dijkstra").click(function() {
        let algorithm = new BFS(grid);
        algorithm.visualise();
    })
    
    // Maze Generation
    $(".random-maze-generator").click(function() {
        grid.clearGrid();
        grid.randomGridGenerator();
    });

    $(".invert-grid").click(function() {
        grid.invertGrid();
    });

    // Controls
    $(".clear-grid-button").click(function() {
        grid.clearGrid();
    });

    $(".clear-path-button").click(function() {
        grid.clearPath();
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
    // Mouse Event Listeners
    let mouseIsDown = false
    let startIsDragging = false
    let endIsDragging = false

    $(".node").mousedown(function() {
        let node = grid.getNode(this);
        if (node.start === true) {
            startIsDragging = true;
        } else if (node.end === true) {
            endIsDragging = true;
        } else {
            grid.animator.changeToWall(node);
            mouseIsDown = true;
        }
    }).mouseup(function() {
        startIsDragging = false;
        endIsDragging = false;
        mouseIsDown = false;
    });

    // Start and End Node event listeners
    $(".node").mouseenter(function() {
        let node = grid.getNode(this);

        if (startIsDragging && (node.end === false)) {
            grid.setStart(node, grid.start_node);
        } else if (endIsDragging && (node.start == false)) {
            grid.setEnd(node, grid.end_node);
        } else if (mouseIsDown) {
            grid.animator.changeToWall(grid.getNode(this));
        }
    })


}