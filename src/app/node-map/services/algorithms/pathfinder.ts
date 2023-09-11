import { Node } from 'src/app/node/node';

// base class for all pathfinding algorithms
export class Pathfinder {
  startingNode: Node;
  endingNode: Node;
  unvisitedNodes: Node[];
  currentNode: Node;
  iterationCount: number = 0;
  doIteration: any;
  heuristicWeight : number = 0;

  setAlgorithmValues(start: Node, end: Node) {
    this.startingNode = start;
    this.startingNode.pathDistance = 0;
    this.endingNode = end;
    this.unvisitedNodes = [start];
    this.currentNode = start;
    this.iterationCount = 0;
  };

  getUnvisitedNeighbours = (node: Node) => {
    let nodeNeighbours = node.neighbours

    return [...nodeNeighbours.filter((neighbour) => !neighbour.node.isBlocked && !neighbour.node.isVisited)];
  };

  checkIfDone = (): { isDone: boolean, reason?: string } => {
    if (this.currentNode === this.endingNode) {
      return { isDone: true, reason: 'reached end' };
    } else if (this.unvisitedNodes.length == 0) {
      return { isDone: true, reason: 'no solution' };
    } else {
      return { isDone: false };
    }
  };

  doCompleteCycle = () => {
    while (!this.checkIfDone().isDone) {
      this.doIteration();
    }
  }

  getPath = (nodeToTrace: Node): Node[] => {
    let pathNodes = [];

    while (nodeToTrace.parent) {
      pathNodes.push(nodeToTrace);
      nodeToTrace = nodeToTrace.parent;
    }

    return pathNodes;
  }
}
