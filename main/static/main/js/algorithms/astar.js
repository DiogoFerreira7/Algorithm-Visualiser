import {Animations} from '../animations.js';

export class AStar {

    constructor(grid) {
        this.animator = new Animations();
        this.grid = grid;
        this.heuristicType = grid.heuristic;
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

        if (this.heuristicType == "euclidian") {
            // Euclidian Distance
            let c = x**2 + y**2
            return Math.sqrt(c);
        } else if (this.heuristicType == "manhattan") {
            // Manhattan Distance
            return x + y;
        }
    }

    sort_nodes() {
        this.nodes_to_traverse.sort((node1, node2) => {
            if (node1.f_cost > node2.f_cost) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    async astar() {
        // Initialise the start node and push it to the list with the lowest f_score of 0 so that it is guarenteed searched first
        let node = null;
        this.nodes_to_traverse.push(this.startNode);
        this.startNode.g_cost = 0;
        this.startNode.f_cost = 0;

        // While there are still nodes to search
        while (this.nodes_to_traverse.length) {
            // Sort nodes according to their f_cost
            this.sort_nodes();
            // Get the first node which has the lowest f_cost
            node = this.nodes_to_traverse.shift();

            // If the current node is the target node end and find the path
            if (node.end === true) {
                this.getPath();
                return 0;
            }

            // Initialise the previous node so we can find the path
            this.previous_node = node;
            node.neighbours.forEach((neighbour) => {
                // For each neighbour which has not yet been traversed and is not a wall
                if (neighbour.wall != true && neighbour.traversed != true) {
                    // Change the colour of traversed unless it is the start and end node
                    if (neighbour.start != true && neighbour.end != true) {
                        this.animator.setTraversed(neighbour);
                    }

                    // Calculates the heuristic
                    neighbour.h_cost = this.heuristic(neighbour);
                    // If the new g_cost to the neighbours is less than their previous update their g_cost and f_cost so that if a new path is found we discovered it
                    if (1 + node.g_cost < neighbour.g_cost) {
                        neighbour.g_cost = 1 + node.g_cost;
                        neighbour.f_cost = neighbour.g_cost + neighbour.h_cost;
                    }

                    // append each node to the list and just make it so when picking a new node you just choose which one has the shortest f value
                    this.updatePath(neighbour);
                    this.nodes_to_traverse.push(neighbour);
                    neighbour.traversed = true;
                }
            });

            await this.sleep(0);
        }

        $(".no-path-toast").toast("show");
    }
}