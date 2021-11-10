import {Grid} from './main.js';
import {BFS} from './algorithms/bfs.js';
import {DFS} from './algorithms/dfs.js';
import {AStar} from './algorithms/astar.js';
// import {Dijkstra} from './algorithms/dijkstra.js';

$(document).ready(function() {
    // Grid Initialisation
    let grid = new Grid($(".grid-ratio").val());
    var choice = null;
    grid.createGrid();
    
    // Mouse Event Listeners
    gridEditor(grid);
    
    // Algorithms
    $(".astar").click(function() {
        choice = "astar";
        $(".visualise").html("Run A*");
    })
    
    $(".bfs").click(function() {
        choice = "bfs";
        $(".visualise").html("Run BFS");
    })
    
    $(".dfs").click(function() {
        choice = "dfs";
        $(".visualise").html("Run DFS");
    })
    
    $(".visualise").click(function() {
        let algorithm;
        switch(choice) {
            case "astar":        
                algorithm = new AStar(grid);
                algorithm.visualise();
                break;
            case "bfs":
                algorithm = new BFS(grid);
                algorithm.visualise();
                break;
            case "dfs":
                algorithm = new DFS(grid);
                algorithm.visualise();
                break;
            default:
                console.log("no algorithm picked, pop over activated");
                $(".no-algorithm-toast").toast("show");
                break;    
        }
    })
    
    // Maze Generation
    $(".random-maze-generator").click(function() {
        grid.clearGrid();
        grid.randomGridGenerator();
    });
    
    $(".density-input-button").click(function() {
        grid.randomGenerationDensity = $(".generation-density").val();
    })
    
    $(".invert-grid").click(function() {
        grid.invertGrid();
    });
    
    // Controls
    $(".clear-grid-button").click(function() {666
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

    $(".random-maze-settings-icon").click(function() {
        $(".random-maze-settings-modal").modal("show");
    });
    
    $(".colour-picker-input").click(function() {
        $(".colour-picker-modal").modal("show");
    });

    $(".save-colour-button").click(function() {
        // Creates a new grid when there
        grid.clearGrid();
    })

    $(".reset-colour-button").click(function() {
        // just set them back to the original values
        grid.animator.startNodeColour = "#66ffa6";
        grid.animator.endNodeColour = "ff0000";
        grid.animator.wallNodeColour = "000000";
        grid.animator.traversedNodeColour = "#00ffff";
        grid.animator.pathNodeColour = "ffff00";
        // Change values of the actual html back to originals
        $(".start-colour-input").val() = "#66ffa6";
        $(".end-colour-input").val() = "ff0000";
        $(".wall-colour-input").val() = "000000";
        $(".traversed-colour-input").val() = "#00ffff";
        $(".path-colour-input").val() = "ffff00";
    })
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
            grid.setStart(node, grid.startNode);
        } else if (endIsDragging && (node.start == false)) {
            grid.setEnd(node, grid.endNode);
        } else if (mouseIsDown && (node.start === false) && (node.end === false)) {
            grid.animator.changeToWall(grid.getNode(this));
        }
    })

}