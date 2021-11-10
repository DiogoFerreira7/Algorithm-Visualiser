import {Animations} from '../../js/animations.js';

export class AStar {

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
        this.astar();
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
        console.log(this.nodes_to_traverse, "yes");
        this.nodes_to_traverse.sort((node1, node2) => {
            if (node1.f_cost > node2.f_cost) {
                return 1;
            } else {
                return -1;
            }
        });
        console.log(this.nodes_to_traverse);
    }

    async astar() {
        let node = null;
        this.nodes_to_traverse.push(this.startNode);
        this.startNode.g_cost = 0;
        this.startNode.f_cost = 0;

        while (this.nodes_to_traverse) {
            // check if +1 makes a difference
            this.sort_nodes();
            node = this.nodes_to_traverse.shift();
            console.log(node);

            if (node.end === true) {
                this.getPath();
                break;
            }

            this.previous_node = node;
            // For each neighbour from the shortest current node
            node.neighbours.forEach((neighbour) => {
                if (neighbour.wall != true && neighbour.traversed != true) {
                    if (neighbour.start != true && neighbour.end != true) {
                        this.animator.setTraversed(neighbour);
                    }

                    // Calculate the heuristic cost of the node
                    let h_cost = this.heuristic(neighbour);
                    // If the total cost of the new path is lesser than the previously set path
                    if (1 + node.g_cost + h_cost < neighbour.f_cost) {
                        neighbour.g_cost = 1 + node.g_cost;
                        neighbour.f_cost = neighbour.g_cost + h_cost;
                    }
                    // append each node to the list and just make it so when picking a new node you just choose which one has the shortest f value
                    this.updatePath(neighbour);
                    this.nodes_to_traverse.push(neighbour);
                    neighbour.traversed = true;
                }
            });

            await this.sleep(15);
        }
    }
}