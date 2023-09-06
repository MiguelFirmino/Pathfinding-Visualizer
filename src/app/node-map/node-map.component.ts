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
  styleUrls: ['./node-map.component.scss'],
})
export class NodeMapComponent implements OnInit {
  @Input() headerComponent: HeaderComponent;

  constructor(
    private nodeMapService: NodeMapService,
    private dijkstraService: DijkstraService,
    private aStartService: AStarService,
    private depthFirstSearchService: DepthFirstSearchService
    ) {}

  message: string = '';
  isAnimated: boolean;
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
  pathAnimationInterval: any;

  clearMap = () => {
    for (let node of this.nodeMap) {
      node.parent = undefined;
      node.pathDistance = Infinity;
      node.heuristicDistance = Infinity;
      node.isVisited = false;
      node.isProspected = false;
    }

    clearInterval(this.pathAnimationInterval);
    this.nodePath = [];
    this.setStartingNode(this.startingNode);
    this.setEndingNode(this.endingNode);
    this.stopAlgorithm();
    this.headerComponent.resetAlgorithmButton();
  };

  receiveClickedNode = (node) => {
    // console.log(
    //   `Node at x: ${node.xPosition}, y: ${node.yPosition} has been clicked`
    // );
    console.log(this.nodeMap.indexOf(node));

    // set node function depending on what kind of node was clicked
    if (node === this.startingNode) {
      this.nodeFunction = this.setStartingNode;
    } else if (node === this.endingNode) {
      this.nodeFunction = this.setEndingNode;
    } else if (!node.isBlocked) {
      this.blockNode(node);
      this.nodeFunction = this.blockNode;
    } else {
      this.unblockNode(node);
      this.nodeFunction = this.unblockNode;
    }
  };

  receiveMovedNode = (node) => {
    // do function that was previously defined on mousedown
    this.nodeFunction(node);
  };

  blockNode = (node) => {
    if (
      node !== this.startingNode &&
      node !== this.endingNode &&
      ((!node.isVisited && !node.isProspected) || !this.isAlgorithmOperating)
    ) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is now %cblocked`,
        'color: yellow'
      );
      node.isBlocked = true;
    } else {
      console.log(
        `%cUnable to block node at ${node.xPosition}, ${node.yPosition}`,
        'color: red'
      );
    }
  };

  unblockNode = (node) => {
    if (node.isBlocked) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is now %cunblocked`,
        'color: lightgreen'
      );
      node.isBlocked = false;
    }
  };

  setStartingNode = (node) => {
    if (
      !node.isBlocked &&
      node != this.endingNode &&
      !this.isAlgorithmOperating
    ) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is now %cstarting Node`,
        'color: lightblue'
      );
      this.startingNode = node;
    } else {
      console.log(
        `%cUnable to set node at ${node.xPosition}, ${node.yPosition} as starting node`,
        'color: red'
      );
    }
  };

  setEndingNode = (node) => {
    if (
      !node.isBlocked &&
      node != this.startingNode &&
      !this.isAlgorithmOperating
    ) {
      console.log(
        `Node at ${node.xPosition}, ${node.yPosition} is %cnow ending Node`,
        'color: lightgreen'
      );
      this.endingNode = node;
    } else {
      console.log(
        `%cUnable to set node at ${node.xPosition}, ${node.yPosition} as ending node`,
        'color: red'
      );
    }
  };

  startAlgorithm = () => {
    this.isAnimated = true;
    this.clearMap();
    this.algorithmService.setAlgorithmValues(
      this.startingNode,
      this.endingNode
    );

    this.resumeAlgorithm();
  };

  stopAlgorithm = () => {
    clearInterval(this.algorithmInterval);
    this.isAlgorithmOperating = false;
  };

  resumeAlgorithm = () => {
    this.algorithmInterval = setInterval(() => {
      this.doAlgorithmIteration();
    }, this.algorithmDelay);

    this.isAlgorithmOperating = true;
  };

  doAlgorithmIteration = () => {
    this.algorithmService.doIteration();
    
    // trace path to node being visited
    let currentNode = this.algorithmService.currentNode;
    // this.nodePath = this.algorithmService.tracePath(currentNode);

    let { isDone, reason } = this.algorithmService.checkIfDone();

    if (isDone == true) {
      this.stopAlgorithm();
      this.headerComponent.resetAlgorithmButton();

      if (reason == 'reached end') {
        // this.message = `Reached End Node after ${this.aStarService.iterationCount} steps`;
        console.log(
          `Reached End Node after ${this.algorithmService.iterationCount} steps`
        );
        let path = this.algorithmService.tracePath(currentNode);
        this.animatePath(path);
      } else {
        // this.message = `No solution available after ${this.aStarService.iterationCount} steps`;
        console.log(
          `No solution available after ${this.algorithmService.iterationCount} steps`
        );
        this.nodePath = [];
      }
    }
  };

  changeAlgorithmDelay = (newDelay: number) => {
    this.algorithmDelay = newDelay;
    if (this.isAlgorithmOperating) {
      this.stopAlgorithm();
      this.resumeAlgorithm();
    }
  };

  changeAlgorithmService = (newAlgorithm: string) => {
    if (this.isAlgorithmOperating) {
      console.log('(from node-map) %cunable to change algorithm', 'color: red');
      return;
    }
    console.log(
      `(from node-map) %cchanged algorithm to ${newAlgorithm}`,
      'color: lightgreen'
    );
    switch (newAlgorithm) {
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
  };

  // MAKE THIS MORE READABLE
  doCompleteCycle = () => {
    // disable animations to prevent information cluster
    this.isAnimated = false;
    clearInterval(this.pathAnimationInterval);

    this.clearMap();
    this.algorithmService.setAlgorithmValues(
      this.startingNode,
      this.endingNode
    );

    this.algorithmService.doCompleteCycle();

    if (this.algorithmService.checkIfDone().reason != 'no solution') {
      let path = this.algorithmService.tracePath(this.algorithmService.currentNode);
      // this.animatePath(path);
      this.nodePath = path;
    }
  };

  animatePath = (path: []) => {
    let animationDelay = 2000 / path.length ** 2;

    // from start to finish
    this.pathAnimationInterval = setInterval(() => {
      if (path.length > 0) {
        this.nodePath.push(path.pop())
      } else {
        clearInterval(this.pathAnimationInterval);
      }
    }, animationDelay);

    // from finish to start
    // this.pathAnimationInterval = setInterval(() => {
    //   if (path.length > 0) {
    //     this.nodePath.push(path.pop())
    //   } else {
    //     clearInterval(this.pathAnimationInterval);
    //   }
    // }, 20);

    // random selection
    // this.pathAnimationInterval = setInterval(() => {
    //   if (path.length > 0) {
    //     let randomIndex = Math.floor(Math.random()*path.length);
    //     this.nodePath.push(path[randomIndex]);
    //     path.splice(randomIndex, 1);
    //   } else {
    //     clearInterval(this.pathAnimationInterval);
    //   }
    // }, 20);
  }

  // default parameters
  ngOnInit(): void {
    this.algorithmDelay = 50; // 50
    this.mapWidth = 10; // 60
    this.mapHeight = 10; // 30
    this.nodeMap = this.nodeMapService.generateMap(
      this.mapWidth,
      this.mapHeight
    );
    this.startingNode = this.nodeMap[30]; // 854
    this.endingNode = this.nodeMap[60]; // 885
    this.nodePath = [];
    this.isAlgorithmOperating = false;
    this.algorithmDelay = 50; // 50
    this.algorithmService = this.dijkstraService;
    this.isAnimated = true; // true
  }
}
