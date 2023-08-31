import { Injectable } from '@angular/core';
import { Node } from '../../node/node';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {

  constructor() { }

  startingNode: Node;
  endingNode: Node;
  unvisitedNodes: Node[];

  doIteration = () => {
    let [index, closestNode] = this.getClosestNode();

    // algorithm is done when it reaches ending node
    if (closestNode !== this.endingNode) {
      this.visitNode(closestNode);
      this.unvisitedNodes.splice(index, 1);
    } else {
      let path = this.tracePath(closestNode);
      for (let node of path) {
        node.isPath = true;
      }
    } 
  }

  setAlgorithmValues = (start: Node, end: Node) => {
    this.startingNode = start;
    this.startingNode.distance = 0;
    this.endingNode = end;
    this.unvisitedNodes = [this.startingNode];
  }

  // get node of least distance
  getClosestNode = () => {
    let closestNode = this.unvisitedNodes[0];
    let closestNodeIndex = undefined;

    for (let [index, node] of this.unvisitedNodes.entries()) {
      if (node.distance < closestNode.distance) {
          closestNode = node;
          closestNodeIndex = index;
      }
    }

    return [closestNodeIndex, closestNode];
  }

  getUnvisitedNeighbours = (node: Node) => {
    let nodeNeighbours = node.neighbours

    return [...nodeNeighbours.filter((item) => !item.isBlocked && !item.wasVisited)];
  }

  // add all adjacent nodes that haven't been visited to unvisitedNodes list
  // assign adjacent nodes distances and set current node to visited 
  visitNode = (nodeToVisit: Node) => {
    let unvisitedNeighbours = this.getUnvisitedNeighbours(nodeToVisit);

    let potentialDistance = nodeToVisit.distance + 1; // rethink this for adding diagonals

    for (let neighbour of unvisitedNeighbours) {
      if (neighbour.distance > potentialDistance) {
        neighbour.distance = potentialDistance;
        neighbour.parent = nodeToVisit;
        this.unvisitedNodes.push(neighbour);
      }
    }

    if (nodeToVisit !== this.startingNode) {
      nodeToVisit.wasVisited = true;
    }
  }

  // get list of nodes whose parents trace to selected node
  tracePath = (nodeToTrace: Node) => {
    let pathNodes = []

    let pathStart = nodeToTrace;

    while (pathStart.parent != this.startingNode) {
        pathStart = pathStart.parent;
        pathNodes.push(pathStart);
    }

    return pathNodes;
  }
}
