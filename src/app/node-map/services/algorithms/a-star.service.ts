import { Injectable } from '@angular/core';
import { Node } from 'src/app/node/node';
import { Pathfinder } from './pathfinder';

@Injectable({
  providedIn: 'root'
})
export class AStarService extends Pathfinder{

  heuristicWeight = 0.8;

  override doIteration = (): void => {
    let [index, closestNode] = this.getClosestNode();
    this.currentNode = closestNode;

    // algorithm will do iteration regardless of if it's done or not
    this.visitNode(closestNode);
    this.unvisitedNodes.splice(index, 1);

    this.iterationCount += 1;
  }

  // get node of least heuristic distance
  getClosestNode = () => {
    let closestNode = this.unvisitedNodes[0];
    let closestNodeIndex = undefined;

    for (let [index, node] of this.unvisitedNodes.entries()) {
      if (node.heuristicDistance < closestNode.heuristicDistance) {
          closestNode = node;
          closestNodeIndex = index;
      }
    }

    return [closestNodeIndex, closestNode];
  }

  // add all adjacent nodes that haven't been visited to unvisitedNodes list
  // assign adjacent nodes distances and set current node to visited 
  visitNode = (nodeToVisit: Node) => {
    let unvisitedNeighbours = this.getUnvisitedNeighbours(nodeToVisit);

    for (let { node: neighbour, relativeDistance } of unvisitedNeighbours) {
      let potentialDistance = nodeToVisit.pathDistance + relativeDistance;
      let heuristicDistance = Math.abs(neighbour.xPosition - this.endingNode.xPosition)
       + Math.abs(neighbour.yPosition - this.endingNode.yPosition);

      if (neighbour.pathDistance > potentialDistance) {
        neighbour.pathDistance = potentialDistance;
        neighbour.heuristicDistance = potentialDistance + (heuristicDistance * this.heuristicWeight);
        neighbour.parent = nodeToVisit;

        if (!this.unvisitedNodes.includes(neighbour)) {
          this.unvisitedNodes.push(neighbour);
          neighbour.isProspected = true;
        }
      }
    }

    nodeToVisit.isVisited = true;
  }
}
