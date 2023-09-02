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
      let newNeighbours = [];

      let isRightAvailable: boolean = node.xPosition + 1 < mapWidth;
      let isLeftAvailable: boolean = node.xPosition - 1 >= 0;
      let isBelowAvailable: boolean = node.yPosition + 1 < mapHeight;
      let isAboveAvailable: boolean = node.yPosition - 1 >= 0;

      // normal neighbours
      let normalDistance = 1;
      if (isRightAvailable) {
        let rightNeighbour = map[index + 1]; // index + 1 reaches the neighbour to the right on the grid
        newNeighbours.push({ node: rightNeighbour, relativeDistance: normalDistance }); 
      }
      if (isLeftAvailable) {
        let leftNeighbour = map[index - 1]; // index - 1 reaches the neighbour to the left on the grid
        newNeighbours.push({ node: leftNeighbour, relativeDistance: normalDistance }); 
      }
      if (isBelowAvailable) {
        let belowNeighbour = map[index + mapWidth]; // index + mapWidth reaches the neighbour below on the grid
        newNeighbours.push({ node: belowNeighbour, relativeDistance: normalDistance }); 
      }
      if (isAboveAvailable) {
        let aboveNeighbour = map[index - mapWidth]; // index - mapWidth reaches the neighbour above on the grid
        newNeighbours.push({ node: aboveNeighbour, relativeDistance: normalDistance }); 
      }

      // diagonal neighbours
      // let diagonalDistace = 1.414; // approximation of sqrt of 2
      // if (isRightAvailable && isBelowAvailable) {
      //   let southEastNeighbour = map[index + 1 + mapWidth] // index + 1 + mapWidth reaches the SE neighbour on the grid 
      //   newNeighbours.push({ node: southEastNeighbour, relativeDistance: diagonalDistace }); 
      // }
      // if (isRightAvailable && isAboveAvailable) {
      //   let northEastNeighbour = map[index + 1 - mapWidth]; // index + 1 - mapWidth reaches the NE neighbour on the grid
      //   newNeighbours.push({ node: northEastNeighbour, relativeDistance: diagonalDistace }); 
      // }
      // if (isLeftAvailable && isBelowAvailable) {
      //   let southWestNeighbour = map[index - 1 + mapWidth]; // index - 1 + mapWidth reaches the SW neighbour on the grid
      //   newNeighbours.push({ node: southWestNeighbour, relativeDistance: diagonalDistace }); 
      // }
      // if (isLeftAvailable && isAboveAvailable) {
      //   let northWestNeighbour = map[index - 1 - mapWidth] // index - 1 - mapWidth reaches the NW neighbour on the grid
      //   newNeighbours.push({ node: northWestNeighbour, relativeDistance: diagonalDistace });
      // }

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
        pathDistance: Infinity,
        heuristicDistance: Infinity,
        isVisited: false,
        isBlocked: false,
        xPosition: xCoord,
        yPosition: yCoord,
        isProspected: false
      }

      row.push(newNode);
    }

    return row;
  }
}
