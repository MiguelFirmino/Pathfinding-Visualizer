import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Node } from './node';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input() node: Node;
  @Input() isStartingNode: boolean;
  @Input() isEndingNode: boolean;

  @Output() nodeEvent = new EventEmitter<Node>;

  constructor() { }

  ngOnInit() {
    // console.log("A node was initialized");
  }

  sendClickedNode() {
    // Emits this node to parent element 'node-map'
    console.log(`Node at ${this.node.xPosition}, ${this.node.yPosition} has been clicked`);
    this.nodeEvent.emit(this.node);
  }
  
  styleNode() {
    if (this.node.isBlocked) {
      return { backgroundColor : '#444444' };
    } else if (this.isStartingNode) {
      return { backgroundColor : 'blue' };
    } else if (this.isEndingNode) {
      return { backgroundColor : 'red' };
    } else {
      return { backgroundColor : 'white' };
    }
  }
}
