import { Injectable } from '@angular/core';
import { Node } from '../../../node/node';

@Injectable({
  providedIn: 'root'
})
export class DijkstraService {

  constructor() { }

  startingNode: Node;
  endingNode: Node;
  unvisitedNodes: Node[];
  currentNode: Node;
  iterationCount: number = 0;

  doIteration = (): undefined | Node => {
    let [index, closestNode] = this.getClosestNode();
    this.currentNode = closestNode;

    // algorithm is done when it reaches ending node
    if (!this.checkIfDone().isDone) {
      this.visitNode(closestNode);
      this.unvisitedNodes.splice(index, 1);
    } 

    this.iterationCount += 1;
    return closestNode;
  }

  setAlgorithmValues = (start: Node, end: Node) => {
    this.startingNode = start;
    this.startingNode.pathDistance = 0;
    this.endingNode = end;
    this.unvisitedNodes = [this.startingNode];
    this.iterationCount = 0;
  }

  // get node of least distance
  getClosestNode = () => {
    let closestNode = this.unvisitedNodes[0];
    let closestNodeIndex = undefined;

    for (let [index, node] of this.unvisitedNodes.entries()) {
      if (node.pathDistance < closestNode.pathDistance) {
          closestNode = node;
          closestNodeIndex = index;
      }
    }

    return [closestNodeIndex, closestNode];
  }

  getUnvisitedNeighbours = (node: Node) => {
    let nodeNeighbours = node.neighbours

    return [...nodeNeighbours.filter((neighbour) => !neighbour.node.isBlocked && !neighbour.node.isVisited)];
  }

  // add all adjacent nodes that haven't been visited to unvisitedNodes list
  // assign adjacent nodes distances and set current node to visited 
  visitNode = (nodeToVisit: Node) => {
    let unvisitedNeighbours = this.getUnvisitedNeighbours(nodeToVisit);

    for (let { node: neighbour, relativeDistance } of unvisitedNeighbours) {
      let potentialDistance = nodeToVisit.pathDistance + relativeDistance;

      if (neighbour.pathDistance > potentialDistance) {
        neighbour.pathDistance = potentialDistance;
        neighbour.parent = nodeToVisit;

        if (!this.unvisitedNodes.includes(neighbour)) {
          this.unvisitedNodes.push(neighbour);
          neighbour.isProspected = true;
        }
      }
    }

    if (nodeToVisit !== this.startingNode) {
      nodeToVisit.isVisited = true;
    }
  }

  checkIfDone = (): { isDone: boolean, reason?: string } => {
    if (this.currentNode === this.endingNode) {
      return { isDone: true, reason: 'reached end' };
    } else if (this.unvisitedNodes.length == 0) {
      return { isDone: true, reason: 'no solution' };
    } else {
      return { isDone: false };
    }
  }

  // get list of nodes whose parents trace to selected node
  tracePath = (nodeToTrace: Node) => {
    let pathNodes = [nodeToTrace];

    while (nodeToTrace.parent) {
      nodeToTrace = nodeToTrace.parent;
      pathNodes.push(nodeToTrace);
    }

    return pathNodes;
  }
}
