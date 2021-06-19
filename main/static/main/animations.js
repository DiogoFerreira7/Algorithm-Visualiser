export class Animations {

    clearNode(node) {
        node.wall = false;
        node.div.removeClass("wall");
    }
    
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
        node.div.addClass("start-node");
    }

    setEndAnimation(node) {
        node.end = true;
        node.div.addClass("end-node");
    }
    
}