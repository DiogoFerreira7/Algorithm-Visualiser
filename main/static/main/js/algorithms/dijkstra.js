import {Animations} from '../animations.js';

export class Dijkstra {

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
        this.dijkstra();
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

    async dijkstra() {
        console.log("running dij")
        let node = null;
        this.nodes_to_traverse.push(this.startNode);

        while (this.nodes_to_traverse.length) {
            node = this.nodes_to_traverse.shift();

            if (node.end === true) {
                this.getPath();
                return 0;
            }

            this.previous_node = node;
            node.neighbours.forEach((neighbour) => {
                // For each neighbour which has not yet been traversed and is not a wall
                if (neighbour.wall != true && neighbour.traversed != true) {
                    // Change the colour of traversed unless it is the start and end node
                    if (neighbour.start != true && neighbour.end != true) {
                        this.animator.setTraversed(neighbour);
                    }

                    // append each node to the list and just make it so when picking a new node you just choose which one has the shortest f value
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
