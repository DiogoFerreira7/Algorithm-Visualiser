import {Animations} from '../animations.js';

export class Dijkstra {

    constructor(grid) {
        this.animator = new Animations();
        this.grid = grid;
        this.start_node = grid.start_node;
        this.end_node = grid.end_node;
    }

    visualise() {
        this.dijkstra();
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    
    async dijkstra() {

        await this.sleep(10);
    }

}
