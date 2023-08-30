import { Injectable } from '@angular/core';
import { Node } from '../../node/node';

@Injectable({
  providedIn: 'root'
})
export class NodeMapService {
  generateMap = (width: number, height: number) => {
    let map = [];

    for (let i = 0; i < height; i++) {
      map.push(...this.generateRow(width, i));
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
        yPosition: yCoord,
        // neighbours: Node[], --IMPLEMENT
      }

      row.push(newNode);
    }

    return row;
  }
}
