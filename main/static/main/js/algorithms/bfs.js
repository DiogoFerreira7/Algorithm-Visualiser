import {Animations} from '../../js/animations.js';

export class BFS {

    constructor(grid) {
        this.animator = new Animations();
        this.grid = grid;
        this.startNode = grid.startNode;
        this.endNode = grid.endNode;
        this.queue = [];
        this.previous_map = new Map();
        this.previous_node = this.startNode;
    }

    visualise() {
        // visualise allows to call visualise for all algorithms even when they have different names
        this.bfs();
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    updatePath(node) {
        this.previous_map.set(node, this.previous_node);
    }

    getPath() {
        let path = [];
        let prev;
        prev = this.endNode;
        while (prev != this.startNode) {
            prev = this.previous_map.get(prev);
            path.push(prev);
        }

        // Removes the startNode so it doesn't get coloured
        // DFS Uses a stack and so uses pop() to remove the last element which is the last added to whilst bfs uses a queue with shift to remove the first added element
        path.pop();
        this.animator.tracePath(path);
    }

    async bfs() {
        let node = null;
        this.queue.push(this.startNode);

        while (this.queue) {
            node = this.queue.shift();

            // In order to not animate the start and end nodes
            if (node.start != true && node.end != true) {
                this.animator.setTraversed(node);
            }
            if (node.end === true) {
                this.getPath();
                break;
            }

            this.previous_node = node;
            node.neighbours.forEach((neighbour) => {
                if (neighbour.wall != true && neighbour.traversed != true) {
                    neighbour.traversed = true;
                    this.updatePath(neighbour);
                    this.queue.push(neighbour);
                }
            });

            await this.sleep(10);
            // Node not found function, pop up on bottom right with info
        }   
    }
}