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

  @Output() nodeClickEvent = new EventEmitter<Node>;
  @Output() nodeMoveEvent = new EventEmitter<Node>;

  constructor() { }

  infinity = Infinity;

  sendClickedNode = () => {
    // Emits this node to parent element 'node-map'
    // console.log(`Node at ${this.node.xPosition}, ${this.node.yPosition} has been clicked`);
    this.nodeClickEvent.emit(this.node);
  }

  sendMovednode = (event) => {
    if (event.buttons === 1) {
      this.nodeMoveEvent.emit(this.node);
    }
  }
}
