import { Injectable } from '@angular/core';
import { Node } from 'src/app/node/node';

@Injectable({
  providedIn: 'root'
})
export class DepthFirstSearchService {

  constructor() { }

  startingNode: Node;
  endingNode: Node;
  unvisitedNodes: Node[];
  currentNode: Node;
  iterationCount: number = 0;

  doIteration = () => {
    let mostRecentNode = this.unvisitedNodes.pop();
    this.currentNode = mostRecentNode;

    // algorithm will do iteration regardless of if it's done or not
    this.visitNode(mostRecentNode);

    this.iterationCount += 1;
  }

  setAlgorithmValues = (start: Node, end: Node) => {
    this.startingNode = start;
    this.startingNode.pathDistance = 0;
    this.endingNode = end;
    this.unvisitedNodes = [this.startingNode];
    this.iterationCount = 0;
  }

  getUnvisitedNeighbours = (node: Node) => {
    let nodeNeighbours = node.neighbours

    return [...nodeNeighbours.filter((neighbour) => !neighbour.node.isBlocked && !neighbour.node.isVisited)];
  }

  // add all adjacent nodes that haven't been visited to unvisitedNodes list
  // assign adjacent nodes distances and set current node to visited 
  visitNode = (nodeToVisit: Node) => {
    let unvisitedNeighbours = this.getUnvisitedNeighbours(nodeToVisit);

    for (let { node: neighbour } of unvisitedNeighbours) {
      neighbour.parent = nodeToVisit;

      if (!this.unvisitedNodes.includes(neighbour)) {
        this.unvisitedNodes.push(neighbour);
        neighbour.isProspected = true;
      }
    }

    nodeToVisit.isVisited = true;
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