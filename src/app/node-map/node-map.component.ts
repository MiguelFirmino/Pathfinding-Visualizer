import { Component, OnInit, Input, HostListener } from '@angular/core';
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

  @HostListener('document:keydown.Space') onKeyDown() { 
    this.doCompleteCycle();
  }

  constructor(
    private nodeMapService: NodeMapService,
    private dijkstraService: DijkstraService,
    private aStartService: AStarService,
    private depthFirstSearchService: DepthFirstSearchService
    ) {}

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
  algorithmService: DijkstraService | AStarService | DepthFirstSearchService;
  pathAnimationInterval: any;
  isInstaOn: boolean;

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
    this.stopAlgorithm();
  };

  receiveClickedNode = (event) => {
    let node = event.node;

    if (event.isRightClick) {
      if (node.weight == 0) {
        this.putWeightOnNode(node);
        this.nodeFunction = this.putWeightOnNode;
      } else {
        this.removeWeightOnNode(node);
        this.nodeFunction = this.removeWeightOnNode;
      }

      this.autoComplete();
      return;
    }

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

    this.autoComplete();
  };

  receiveMovedNode = (node) => {
    // do function that was previously defined on mousedown
    this.nodeFunction(node);
    this.autoComplete();
  };

  putWeightOnNode = (node) => {
    if (node != this.startingNode && node != this.endingNode) {
      node.weight = 10;
      node.isBlocked = false;
    }
  }

  removeWeightOnNode = (node) => {
    node.weight = 0;
    node.isBlocked = false;
  }

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
      return;
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

    this.removeWeightOnNode(node);
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
      return;
    }
  };

  setEndingNode = (node) => {
    if (!node.isBlocked &&
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
      return;
    }
  };

  startAlgorithm = () => {
    this.isAnimated = true;
    this.isInstaOn = false;
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

    let { isDone, reason } = this.algorithmService.checkIfDone();

    if (isDone == true) {
      this.stopAlgorithm();

      if (reason == 'reached end') {
        console.log(
          `Reached End Node after ${this.algorithmService.iterationCount} steps`
        );
        let currentNode = this.algorithmService.currentNode;
        let path = this.algorithmService.getPath(currentNode);
        this.animatePath(path);
      } else {
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
    console.log(
      `(from node-map) %cchanged algorithm to ${newAlgorithm}`,
      'color: lightgreen'
    );
    
    // reset previous service before changing
    this.algorithmService.setAlgorithmValues(this.startingNode, this.endingNode);
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

    this.autoComplete();
  };

  toggleInstantVisualization = () => {
    this.isInstaOn = !this.isInstaOn
    
    this.autoComplete();
  }

  autoComplete = () => {
    if (this.isInstaOn) {
      this.doCompleteCycle();
    }
  }

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
      let path = this.algorithmService.getPath(this.algorithmService.currentNode);
      this.nodePath = path;
    }
  };

  // appends nodes to path in an animated matter
  animatePath = (path: Node[]) => {
    let animationDelay = 2000 / path.length ** 2;

    // from start to end
    this.pathAnimationInterval = setInterval(() => {
      if (path.length > 0) {
        this.nodePath.push(path.pop())
      } else {
        clearInterval(this.pathAnimationInterval);
      }
    }, animationDelay);

    // from end to start
    // this.pathAnimationInterval = setInterval(() => {
    //   if (path.length > 0) {
    //     this.nodePath.push(path.pop())
    //   } else {
    //     clearInterval(this.pathAnimationInterval);
    //   }
    // }, 20);

    // random
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
    this.mapWidth = 60; // 60
    this.mapHeight = 30; // 30
    this.nodeMap = this.nodeMapService.generateMap(
      this.mapWidth,
      this.mapHeight
    );

    this.startingNode = this.nodeMap[854]; // 854
    this.endingNode = this.nodeMap[885]; // 885
    this.nodePath = [];
    this.isAlgorithmOperating = false;
    this.algorithmDelay = 50; // 50
    this.algorithmService = this.dijkstraService;
    this.isAnimated = true; // true
  }
}
