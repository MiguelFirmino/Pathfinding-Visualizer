import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Node } from './node';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  // lets try to come up with a better solution for this
  @Input() node: Node;
  @Input() isStartingNode: boolean;
  @Input() isEndingNode: boolean;
  @Input() isPathNode: boolean;

  @Output() nodeEvent = new EventEmitter<Node>;

  constructor() { }

  infinity = Infinity;

  sendClickedNode = () => {
    // Emits this node to parent element 'node-map'
    // console.log(`Node at ${this.node.xPosition}, ${this.node.yPosition} has been clicked`);
    this.nodeEvent.emit(this.node);
  }
  
  styleNode = () => {
    if (this.node.isBlocked) {
      return { backgroundColor : '#444444' };
    }
    if (this.isStartingNode) {
      return { backgroundColor : 'blue' };
    }
    if (this.isEndingNode) {
      return { backgroundColor : 'red' };
    }
    if (this.isPathNode) {
      return { backgroundColor : 'orange' };
    }
    if (this.node.isVisited) {
      return { backgroundColor : 'yellow' };
    }
    if (this.node.isProspected) {
      return { backgroundColor : '#75FF57' };
    }
    
    return { backgroundColor : 'white' };
  }
}
