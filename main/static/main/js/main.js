import {Animations} from './animations.js';

export class Node {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.wall = false;
        this.start = false;
        this.end = false;
        this.traversed = false;
        this.path = false;
        this.neighbours = [];
        this.f_cost = Infinity;
        this.g_cost = Infinity;
        this.h_cost = Infinity;
        this.div = $(`.row-${this.row}-column-${this.column}`);
    }
}

export class Grid {
    constructor(gridRatio) {
        this.gridRatio = gridRatio;
        this.container = $(".main");
        this.gridWidth = 1600;
        this.gridHeight = 800;
        this.rowNodes = this.gridRatio * 8;
        this.columnNodes = this.gridRatio * 16;
        this.board = [];
        this.startNode = null;
        this.endNode = null;
        this.animator = new Animations();
        this.gridBorder = true;
        this.randomGenerationDensity = 0.5;
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
        
        this.clearGrid();

        // Gets the neighbours for all of the grid elements
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                this.getNeighbours(this.board[i][j]);
            }
        }
    }

    setStart(newNode, originalNode = null) {
        // console.log(this.originalNode.start);
        if (originalNode) {
            this.animator.removeStartAnimation(originalNode);
        }

        // set new grid class start node to the new node
        this.startNode = newNode;
        this.animator.setStartAnimation(newNode);
    }

    setEnd(newNode, originalNode = null) {
        if (originalNode) {
            this.animator.removeEndAnimation(originalNode);
        }

        this.endNode = newNode;
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
        let density_weight = 0.75;
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                if (Math.random() < (this.randomGenerationDensity * density_weight)) {
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
                let node = this.board[i][j];
                if ((node.start) || (node.end)) {
                    node.traversed = false;
                } else {
                    this.animator.clearNode(node);
                    if (node.traversed) {
                        this.animator.removeTraversed(node);
                    }
                    if (node.path) {
                        this.animator.removePath(node);
                    }
                }
            }
        }
    }

    recolourGrid() {
        for (let i = 0; i < this.rowNodes; i++) {
            for (let j = 0; j < this.columnNodes; j++) {
                let node = this.board[i][j];
                this.animator.recolourNode(node);
            }
        }
    }

    clearPath() {
        for (let i = 0; i < this.rowNodes; i++ ) {
            for (let j = 0; j < this.columnNodes; j++) {
                let node = this.board[i][j];
                // Checking traversed nodes - has to remove traversed from start and end nodes so they can run
                if ((node.start) || (node.end)) {
                    node.traversed = false;
                } else if (node.traversed) {
                //  && (node.start !== true) && (node.end !== true)) {
                    this.animator.removeTraversed(node);
                }
                if (node.path) {
                    this.animator.removePath(node);
                }
            }
        }
    }
}

