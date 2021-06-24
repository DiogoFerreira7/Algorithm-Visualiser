import {Animations} from '../animations.js';

export class BFS {

    constructor(grid) {
        this.animator = new Animations();
        this.grid = grid;
    }

    visualise() {
        console.log("should run bfs")
        this.bfs();
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async bfs() {
        let node = null;
        let queue = [];
        queue.push(this.grid.start_node);

        while (queue) {
            node = queue.shift();

            // In order to not animate the start and end nodes
            if (node.start != true && node.end != true) {
                this.animator.setTraversed(node);
            }

            console.log(node, node.end);
            if (node.end === true) {
                console.log("DONE")
                alert("Algorithm finished");
                break;
            }

            // Appending the new nodes that will be traversed in the list
            node.neighbours.forEach((neighbour) => {
                if (neighbour.wall != true && neighbour.traversed != true) {
                    // sets node to traversed so that they don't get enqueued again
                    neighbour.traversed = true;
                    queue.push(neighbour);
                }
            })

            await this.sleep(0);
        
            // End found node - and traversal back functions
            // Node not found function
        }
        

    }

}