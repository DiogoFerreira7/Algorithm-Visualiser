export class Animations {

    constructor() {
        this.defaultNodeColour = "ffffff";
        this.startNodeColour = $(".start-colour-input").val();
        this.endNodeColour = $(".end-colour-input").val();
        this.wallNodeColour = $(".wall-colour-input").val();
        this.traversedNodeColour = $(".traversed-colour-input").val();
        this.pathNodeColour = $(".path-colour-input").val()
    }

    setNodeColour(node, value) {
        node.css("background-color", value);
    }

    clearNode(node) {
        node.wall = false;
        this.setNodeColour(node.div, this.defaultNodeColour);
    }
    
    changeToWall(node) {
        if ((node.start !== true) && (node.end !== true)) {
            if (node.wall == true) {
                node.wall = false;
                this.setNodeColour(node.div, this.defaultNodeColour);
            } else {
                node.wall = true;
                this.setNodeColour(node.div, this.wallNodeColour);
            }
        }
    }

    setStartAnimation(node) {
        node.start = true;
        this.clearNode(node);
        this.setNodeColour(node.div, this.startNodeColour);
    }

    removeStartAnimation(node) {
        node.start = false;
        this.setNodeColour(node.div, this.defaultNodeColour);
    }

    setEndAnimation(node) {
        node.end = true;
        this.clearNode(node);
        this.setNodeColour(node.div, this.endNodeColour);
    }

    removeEndAnimation(node) {
        node.end = false;
        this.setNodeColour(node.div, this.defaultNodeColour);
    }

    setTraversed(node) {
        node.traversed = true;
        this.setNodeColour(node.div, this.traversedNodeColour);
    }

    removeTraversed(node) {
        node.traversed = false;
        this.setNodeColour(node.div, this.defaultNodeColour);
    }

    tracePath(path) {
        path.forEach((node) => {
            node.path = true;
            this.setNodeColour(node.div, this.pathNodeColour);
        })
    }

    removePath(node) {
        node.path = false;
        this.setNodeColour(node.div, this.defaultNodeColour);
    }
    
}