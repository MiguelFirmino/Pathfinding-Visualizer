import { Component, OnInit, Input } from '@angular/core';
import { NodeMapService } from './services/node-map.service';
import { DijkstraService } from './services/algorithms/dijkstra.service';
import { AStarService } from './services/algorithms/a-star.service';
import { HeaderComponent } from '../header/header.component';
import { Node } from '../node/node';

@Component({
  selector: 'app-node-map',
  templateUrl: './node-map.component.html',
  styleUrls: ['./node-map.component.scss']
})
export class NodeMapComponent implements OnInit {

  @Input() headerComponent: HeaderComponent;

  constructor (private nodeMapService: NodeMapService, 
    private dijkstraService: DijkstraService,
    private aStarService: AStarService) { }  

  message: string = '';
  mapWidth: number;
  mapHeight: number;
  nodeMap: Node[];
  startingNode: Node;
  endingNode: Node;
  nodeFunction: any;
  nodePath: Node[];
  isAlgorithmOperating: boolean;
  algorithmDelay: number;
  algorithmInterval: any;
  
  setMapSize = (newWidth: number, newHeight: number) => {
    console.log("(from node-map) received map size");
    this.startingNode = undefined;
    this.endingNode = undefined;
    this.mapWidth = newWidth;
    this.mapHeight = newHeight;
    this.nodeMap = this.nodeMapService.generateMap(this.mapWidth, this.mapHeight);
    this.stopAlgorithm();
    this.headerComponent.resetAlgorithmButton();
  }
  
  clearMap = () => {
    for (let node of this.nodeMap) {
      node.parent = undefined;
      node.pathDistance = Infinity;
      node.heuristicDistance = Infinity;
      node.isVisited = false;
      node.isProspected = false;
    }

    this.nodePath = [];
    this.setStartingNode(this.startingNode);
    this.setEndingNode(this.endingNode);
    this.stopAlgorithm();
    this.headerComponent.resetAlgorithmButton();
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
    if (node !== this.startingNode && node !== this.endingNode && !node.isVisited && !node.isProspected) {
      console.log(`Node at ${node.xPosition}, ${node.yPosition} is blocked: ${!node.isBlocked}`);
      node.isBlocked = !node.isBlocked;
    } else {
      console.log(`Unable to block node at ${node.xPosition}, ${node.yPosition}`);
    }
  }

  setStartingNode = (node) => {
    if (node != this.endingNode && !this.isAlgorithmOperating) {
      console.log(`Node at ${node.xPosition}, ${node.yPosition} is now starting Node`);
      this.startingNode = node;
      node.isBlocked = false;
    } else {
      console.log(`Unable to set node at ${node.xPosition}, ${node.yPosition} as starting node`);
    }
  }

  setEndingNode = (node) => {
    if (node != this.startingNode && !this.isAlgorithmOperating) {
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

  startAlgorithm = () => {
    this.clearMap();
    this.aStarService.setAlgorithmValues(this.startingNode, this.endingNode);

    this.resumeAlgorithm();
    this.isAlgorithmOperating = true;
  }

  stopAlgorithm = () => {
    clearInterval(this.algorithmInterval);
    this.isAlgorithmOperating = false;
  }

  resumeAlgorithm = () => {
    this.algorithmInterval = setInterval(() => { this.doAlgorithmIteration() }, this.algorithmDelay);
    
    this.isAlgorithmOperating = true;
  }

  doAlgorithmIteration = () => {
    let currentNode = this.aStarService.doIteration();
    this.nodePath = this.aStarService.tracePath(currentNode);

    let { isDone, reason } = this.aStarService.checkIfDone();

    if (isDone == true) {
      clearInterval(this.algorithmInterval);
      this.headerComponent.resetAlgorithmButton();

      if (reason == 'reached end') {
        console.log(`Reached End Node after ${this.aStarService.iterationCount} steps`);
      } else {
        console.log('No solution available');
        this.nodePath = [];
      }
    } 
  }

  changeAlgorithmDelay = (newDelay: number) => {
    this.algorithmDelay = newDelay;
    if (this.isAlgorithmOperating) {
      this.stopAlgorithm()
      this.resumeAlgorithm();
    }
  }

  testFunction = (node) => {
    console.log(`Node at x: ${node.xPosition}, y: ${node.yPosition} has been clicked`);

    // test for checking neighbours
    // for (let { node: neighbour, potentialDistance } of node.neighbours) {
    //   if (neighbour) {
    //     console.log(`Neighbour at ${neighbour.xPosition}, ${neighbour.yPosition}`);
    //   } else {
    //     console.log('Undefined Neighbour');
    //   }
    // }
  }

  // default parameters
  ngOnInit(): void {
    this.nodeFunction = this.testFunction;
    this.algorithmDelay = 50;
    this.mapWidth = 20;
    this.mapHeight = 20;
    this.nodeMap = this.nodeMapService.generateMap(this.mapWidth, this.mapHeight);
    this.startingNode = this.nodeMap[0];
    this.endingNode = this.nodeMap[99];
    this.nodePath = [];
    this.isAlgorithmOperating = false;
    this.algorithmDelay = 50;
  }
}
