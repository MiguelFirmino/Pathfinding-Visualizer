import { Component, OnInit } from '@angular/core';
import { NodeMapService } from './services/node-map.service';
import { AlgorithmService } from './services/algorithm.service';

@Component({
  selector: 'app-node-map',
  templateUrl: './node-map.component.html',
  styleUrls: ['./node-map.component.scss']
})
export class NodeMapComponent implements OnInit {

  constructor (private nodeMapService: NodeMapService, private algorithmService: AlgorithmService) { }  

  // Standard configs
  mapWidth: number = 10;
  mapHeight: number = 10;
  nodeMap = this.nodeMapService.generateMap(this.mapWidth, this.mapHeight);
  startingNode = this.nodeMap[0];
  endingNode = this.nodeMap[99];
  nodeFunction: any;
  
  setMapSize = (newWidth: number, newHeight: number) => {
    console.log("(from node-map) received map size");
    this.startingNode = undefined;
    this.endingNode = undefined;
    this.mapWidth = newWidth;
    this.mapHeight = newHeight;
    this.nodeMap = this.nodeMapService.generateMap(this.mapWidth, this.mapHeight);
  }

  setNodeFunction = (type: string) => {
    console.log("(from node-map) received node function");
    switch(type) {
      case 'test':
        this.nodeFunction = this.testFunction;
        break;
      case 'block':
        this.nodeFunction = this.blockNode;
        break;
      case 'start':
        this.nodeFunction = this.setStartingNode;
        break;
      case 'end':
        this.nodeFunction = this.setEndingNode;
        break;
    }
  }

  blockNode = (node) => {
    if (node !== this.startingNode && node !== this.endingNode) {
      console.log(`Node at ${node.xPosition}, ${node.yPosition} is blocked: ${!node.isBlocked}`);
      node.isBlocked = !node.isBlocked;
    } else {
      console.log(`Unable to block node at ${node.xPosition}, ${node.yPosition}`);
    }

    // test for checking neighbours
    // for (let neighbour of node.neighbours) {
    //   if (neighbour) {
    //     console.log(`Neighbour at ${neighbour.xPosition}, ${neighbour.yPosition}`);
    //   } else {
    //     console.log('Undefined Neighbour');
    //   }
    // }
  }

  setStartingNode = (node) => {
    if (node != this.endingNode) {
      console.log(`Node at ${node.xPosition}, ${node.yPosition} is now starting Node`);
      this.startingNode = node;
      node.isBlocked = false;
    } else {
      console.log(`Unable to set node at ${node.xPosition}, ${node.yPosition} as starting node`);
    }
  }

  setEndingNode = (node) => {
    if (node != this.startingNode) {
      console.log(`Node at ${node.xPosition}, ${node.yPosition} is now ending Node`);
      this.endingNode = node;
      node.isBlocked = false;
    } else {
      console.log(`Unable to set node at ${node.xPosition}, ${node.yPosition} as ending node`);
    }
  }

  receiveClickedNode = ($event) => {
    let clickedNode = $event;

    this.nodeFunction(clickedNode);
  }

  doAlgorithmIteration = () => {
    this.algorithmService.setAlgorithmValues(this.startingNode, this.endingNode);
    setInterval(() => this.algorithmService.doIteration(), 10);
  }

  testFunction = (node) => {
    console.log(`Node at ${node.xPosition}, ${node.yPosition} has been clicked`);

    // test for checking neighbours
    // for (let neighbour of node.neighbours) {
    //   if (neighbour) {
    //     console.log(`Neighbour at ${neighbour.xPosition}, ${neighbour.yPosition}`);
    //   } else {
    //     console.log('Undefined Neighbour');
    //   }
    // }
  }

  ngOnInit(): void {
    this.nodeFunction = this.testFunction;
  }
}
