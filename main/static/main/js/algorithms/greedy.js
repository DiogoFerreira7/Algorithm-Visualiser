import {Animations} from '../animations.js';

export class Greedy {

    constructor(grid) {
        this.animator = new Animations();
        this.grid = grid;
        this.nodes_to_traverse = []
        this.startNode = grid.startNode;
        this.endNode = grid.endNode;
        this.previous_node = this.startNode;
        this.previous_map = new Map();
    }

    visualise() {
        this.greedy();
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

        path.pop();
        this.animator.tracePath(path);
    }

    heuristic(node) {
        let x = Math.abs(node.row - this.endNode.row);
        let y = Math.abs(node.column - this.endNode.column);
        return x + y
    }

    sort_nodes() {
        this.nodes_to_traverse.sort((node1, node2) => {
            if (node1.h_cost > node2.h_cost) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    async greedy() {
        let node = null;
        this.nodes_to_traverse.push(this.startNode);
        this.startNode.g_cost = 0;
        this.startNode.f_cost = 0;

        while (this.nodes_to_traverse.length) {
            // check if +1 makes a difference
            this.sort_nodes();
            node = this.nodes_to_traverse.shift();

            if (node.end === true) {
                this.getPath();
                return 0;
            }

            this.previous_node = node;
            // For each neighbour from the shortest current node
            node.neighbours.forEach((neighbour) => {
                if (neighbour.wall != true && neighbour.traversed != true) {
                    if (neighbour.start != true && neighbour.end != true) {
                        this.animator.setTraversed(neighbour);
                    }
                    // Calculate the heuristic cost of the node
                    neighbour.h_cost = this.heuristic(neighbour);
                    this.updatePath(neighbour);
                    this.nodes_to_traverse.push(neighbour);
                    neighbour.traversed = true;
                }
            });

            await this.sleep(10);
        }

        $(".no-path-toast").toast("show");
    }
}