import { Injectable } from '@angular/core';
import { Node } from '../../node/node';

@Injectable({
  providedIn: 'root'
})
export class NodeMapService {
  generateMap = (mapWidth: number, mapHeight: number) => {
    let map: Node[] = [];

    // generate nodes
    for (let i = 0; i < mapHeight; i++) {
      map.push(...this.generateRow(mapWidth, i));
    } 

    // assings neighbours for each node IMPLEMENT DISTANCE IF NEEDED
    for (let [index, node] of map.entries()) {
      let newNeighbours: Node[] = [];

      if (node.xPosition + 1 < mapWidth) {
        newNeighbours.push(map[index + 1]); // index + 1 reaches the neighbour to the right on the grid
      }
      if (node.xPosition - 1 >= 0) {
        newNeighbours.push(map[index - 1]); // index - 1 reaches the neighbour to the left on the grid
      }
      if (node.yPosition + 1 < mapHeight) {
        newNeighbours.push(map[index + mapWidth]); // index + mapwidth reaches the neighbour below on the grid
      }
      if (node.yPosition - 1 >= 0) {
        newNeighbours.push(map[index - mapWidth]);  // index + mapwidth reaches the neighbour above on the grid
      }

      node.neighbours = newNeighbours;
    }

    return map;
  }

  generateRow = (width: number, yCoord: number): Node[] => {
    let row: Node[] = [];

    for (let xCoord = 0; xCoord < width; xCoord++) {
      let newNode: Node = {
        weight: 1,
        parent: undefined,
        distance: Infinity,
        wasVisited: false,
        isBlocked: false,
        xPosition: xCoord,
        yPosition: yCoord
      }

      row.push(newNode);
    }

    return row;
  }
}
