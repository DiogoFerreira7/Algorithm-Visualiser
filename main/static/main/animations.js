export class Animations {

    clearNode(node) {
        node.wall = false;
        node.div.removeClass("wall");
    }
    
    // Change to 2 separate ones maybe if it works
    changeToWall(node) {
        if (node.wall == true) {
            node.wall = false;
            node.div.removeClass("wall");
        } else {
            node.wall = true;
            node.div.addClass("wall");
        }
    }

    setStartAnimation(node) {
        node.start = true;
        this.clearNode(node);
        node.div.addClass("start-node");

    }

    removeStartAnimation(node) {
        node.start = false;
        node.div.removeClass("start-node");
    }

    setEndAnimation(node) {
        node.end = true;
        this.clearNode(node);
        node.div.addClass("end-node");
    }

    removeEndAnimation(node) {
        node.end = false;
        node.div.removeClass("end-node");
    }

    setTraversed(node) {
        node.traversed = true;
        node.div.addClass("traversed");
    }

    removeTraversed(node) {
        node.traversed = false;
        node.div.removeClass("traversed");
    }
    
}