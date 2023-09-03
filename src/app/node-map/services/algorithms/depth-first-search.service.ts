import { Injectable } from '@angular/core';
import { Node } from 'src/app/node/node';
import { Pathfinder } from './pathfinder';

@Injectable({
  providedIn: 'root'
})
export class DepthFirstSearchService extends Pathfinder {

  doIteration = () => {
    let mostRecentNode = this.unvisitedNodes.pop();
    this.currentNode = mostRecentNode;

    // algorithm will do iteration regardless of if it's done or not
    this.visitNode(mostRecentNode);

    this.iterationCount += 1;
  }

  // add all adjacent nodes that haven't been visited to unvisitedNodes list
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
}