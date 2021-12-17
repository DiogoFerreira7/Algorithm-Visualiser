import {Grid} from './main.js';
import {BFS} from './algorithms/bfs.js';
import {DFS} from './algorithms/dfs.js';
import {AStar} from './algorithms/astar.js';
import {Greedy} from './algorithms/greedy.js';
import {Dijkstra} from './algorithms/dijkstra.js';
import {MazeGenerator} from './algorithms/mazeGeneration.js';

$(document).ready(function() {
    // Grid Initialisation
    let grid = new Grid($(".grid-ratio").val());
    // Maze Generator Initialisation
    let mazeGenerator = new MazeGenerator(grid);
    var choice = null;
    grid.createGrid();

    // Mouse Event Listeners
    gridEditor(grid);
    
    $(".astar").click(function() {
        choice = "astar";
        $(".visualise").html("Run A*");
    })
    
    $(".greedy").click(function() {
        choice = "greedy";
        $(".visualise").html("Run Greedy A*");
    })
    
    $(".bfs").click(function() {
        choice = "bfs";
        $(".visualise").html("Run BFS");
    })
    
    $(".dijkstra").click(function() {
        choice = "dijkstra";
        $(".visualise").html("Run Dijkstra");
    })
    
    $(".dfs").click(function() {
        choice = "dfs";
        $(".visualise").html("Run DFS");
    })
    
    // When run algorithm is ran
    $(".visualise").click(function() {
        // Removes all event handlers from the website when being ran
        if (choice === null) {
            $(".no-algorithm-toast").toast("show");
        } else {
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
                case "greedy":
                    algorithm = new Greedy(grid);
                    algorithm.visualise();
                    break;
                case "dijkstra":
                    algorithm = new Dijkstra(grid);
                    algorithm.visualise();
                    break;
            }
        }
    })

    // Maze Generation

    $(".random-maze-generator").click(function() {
        grid.clearGrid();
        mazeGenerator.randomGridGenerator();
    });
    
    $(".density-input-button").click(function() {
        mazeGenerator.randomGenerationDensity = $(".generation-density").val();
    });
    
    $(".invert-grid").click(function() {
        mazeGenerator.invertGrid();
    });
    
    $(".recursive-maze-generator").click(function() {
        grid.clearGrid();
        mazeGenerator.recursiveGridGenerator();
    })
    
    // Controls
    $(".clear-grid-button").click(function() {
        // Set the new colours
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
            mazeGenerator = new MazeGenerator(grid);
        }
    });

    $(".grid-border-button").click(function() {
        if (grid.gridBorder) {
            grid.animator.removeGridBorder();
            grid.gridBorder = false;
        } else {
            grid.animator.addGridBorder();
            grid.gridBorder = true;
        }
    });

    // Settings Inputs
    $(".random-maze-settings-icon").click(function() {
        $(".random-maze-settings-modal").modal("show");
    });

    // Heuristic Inputs
    $(".euclidian-heuristic").click(function() {
        grid.heuristic = "euclidian";
        console.log("now euclidian");
    })

    $(".manhattan-heuristic").click(function() {
        grid.heuristic = "manhattan";
        console.log("now manhattan");
    })

    
    // Modals for Colour
    $(".colour-picker-input").click(function() {
        $(".colour-picker-modal").modal("show");
    });

    $(".save-colour-button").click(function() {
        // Creates a new grid when there
        grid.animator.changeColours();
        grid.recolourGrid();
    })

    $(".reset-colour-button").click(function() {
        grid.animator.resetColours();
        grid.recolourGrid();
        // Change values of the actual html back to originals
        $(".start-colour-input").val("#66ffa6");
        $(".end-colour-input").val("#ff0000");
        $(".wall-colour-input").val("#000000");
        $(".traversed-colour-input").val("#00ffff");
        $(".path-colour-input").val("#ffff00");
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
