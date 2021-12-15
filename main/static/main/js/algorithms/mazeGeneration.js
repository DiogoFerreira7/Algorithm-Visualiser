import {Animations} from '../animations.js';

export class MazeGenerator {

    constructor(grid) {
        this.grid = grid;
        this.randomGenerationDensity = 0.5;
    }

    randomGridGenerator() {
        let density_weight = 0.75;
        for (let i = 0; i < this.grid.rowNodes; i++ ) {
            for (let j = 0; j < this.grid.columnNodes; j++) {
                if (Math.random() < (this.randomGenerationDensity * density_weight)) {
                    this.grid.animator.changeToWall(this.grid.board[i][j]);
                }
            }
        }
    }

    invertGrid() {
        for (let i = 0; i < this.grid.rowNodes; i++ ) {
            for (let j = 0; j < this.grid.columnNodes; j++) {
                this.grid.animator.changeToWall(this.grid.board[i][j]);
            }
        }
    }

    recursiveGridGenerator() {
        this.invertGrid();
        var node = this.grid.startNode;
        var frontier_nodes = [];
        node.neighbours.forEach(node => {
            frontier_nodes.push(node)
        });
        node.traversed = true;
        
        while (frontier_nodes.length) {
            node = frontier_nodes.splice(Math.floor(Math.random() * frontier_nodes.length), 1)[0];
            
            var num_of_visited = 0;
            node.neighbours.forEach(node => {
                if (node.traversed === true) {
                    num_of_visited++;
                }
            });
            
            if (num_of_visited == 1) {
                this.grid.animator.changeToWall(node);
                
                node.neighbours.forEach(node => {
                    if (node.traversed === false) {
                        frontier_nodes.push(node);
                    }
                });
                node.traversed = true;
            }
        }

        this.grid.board.forEach(row => {
            row.forEach(node => {
                node.traversed = false;
            })
        });
    }
}