import { Component, OnInit, Input } from '@angular/core';
import { NodeMapService } from './services/node-map.service';
import { DijkstraService } from './services/algorithms/dijkstra.service';
import { AStarService } from './services/algorithms/a-star.service';
import { DepthFirstSearchService } from './services/algorithms/depth-first-search.service';
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
    private aStartService: AStarService,
    private depthFirstSearchService: DepthFirstSearchService) { }  

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
  algorithmService: any;
  
  setMapSize = (newWidth: number, newHeight: number) => {
    console.log(`(from node-map) received map size of ${newWidth} x ${newHeight}`);
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

  receiveClickedNode = ($event) => {
    let clickedNode = $event;

    this.nodeFunction(clickedNode);
  };

  setNodeFunction = (type: string) => {
    // console.log(`(from node-map) received node function: ${type}`);
    switch (type) {
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
  };

  blockNode = (node) => {
    if (
      node !== this.startingNode &&
      node !== this.endingNode &&
      !node.isVisited &&
      !node.isProspected
    ) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is now %c${
          !node.isBlocked ? 'blocked' : 'unblocked'
        }`,
        'color: yellow'
      );
      node.isBlocked = !node.isBlocked;
    } else {
      console.log(
        `%cUnable to block node at ${node.xPosition}, ${node.yPosition}`,
        'color: red'
      );
    }
  };

  setStartingNode = (node) => {
    if (node != this.endingNode && !this.isAlgorithmOperating) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is now %cstarting Node`,
        'color: lightblue'
      );
      this.startingNode = node;
      node.isBlocked = false;
    } else {
      console.log(
        `%cUnable to set node at ${node.xPosition}, ${node.yPosition} as starting node`,
        'color: red'
      );
    }
  };

  setEndingNode = (node) => {
    if (node != this.startingNode && !this.isAlgorithmOperating) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is %cnow ending Node`,
        'color: lightgreen'
      );
      this.endingNode = node;
      node.isBlocked = false;
    } else {
      console.log(
        `%cUnable to set node at ${node.xPosition}, ${node.yPosition} as ending node`,
        'color: red'
      );
    }
  };

  testFunction = (node) => {
    console.log(
      `Node at x: ${node.xPosition}, y: ${node.yPosition} has been clicked`
    );
    // console.log(node);
    // console.log(`This node has a heuristic distance of: ${node.heuristicDistance}`);

    // test for checking neighbours
    // for (let { node: neighbour } of node.neighbours) {
    //   if (neighbour) {
    //     console.log(`Neighbour at ${neighbour.xPosition}, ${neighbour.yPosition}`);
    //   } else {
    //     console.log('Undefined Neighbour');
    //   }
    // }
  };

  startAlgorithm = () => {
    this.clearMap();
    this.algorithmService.setAlgorithmValues(this.startingNode, this.endingNode);

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
    this.algorithmService.doIteration();
    
    // trace path to node being visited
    let currentNode = this.algorithmService.currentNode;
    this.nodePath = this.depthFirstSearchService.tracePath(currentNode);

    let { isDone, reason } = this.algorithmService.checkIfDone();

    if (isDone == true) {
      this.stopAlgorithm();
      this.headerComponent.resetAlgorithmButton();

      if (reason == 'reached end') {
        // this.message = `Reached End Node after ${this.aStarService.iterationCount} steps`;
        console.log(`Reached End Node after ${this.algorithmService.iterationCount} steps`);
      } else {
        // this.message = `No solution available after ${this.aStarService.iterationCount} steps`;
        console.log(`No solution available after ${this.algorithmService.iterationCount} steps`);
        this.nodePath = [];
      }

      this.nodePath = this.algorithmService.tracePath(currentNode);
    } 
  }

  changeAlgorithmDelay = (newDelay: number) => {
    this.algorithmDelay = newDelay;
    if (this.isAlgorithmOperating) {
      this.stopAlgorithm()
      this.resumeAlgorithm();
    }
  }

  changeAlgorithmService = (newAlgorithm: string) => {
    if (this.isAlgorithmOperating) {
      console.log('(from node-map) %cunable to change algorithm', 'color: red');
      return;
    }
    console.log(`(from node-map) %cchanged algorithm to ${newAlgorithm}`, 'color: lightgreen');
    switch(newAlgorithm) {
      case 'dijkstra':
        this.algorithmService = this.dijkstraService;
        break;
      case 'a-star':
        this.algorithmService = this.aStartService;
        break;
      case 'depth-first-search':
        this.algorithmService = this.depthFirstSearchService;
        break;
    }
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
    this.algorithmService = this.dijkstraService;
  }
}
