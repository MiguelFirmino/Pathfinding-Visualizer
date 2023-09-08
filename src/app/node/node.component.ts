import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Node } from './node';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input() node: Node;

  @Output() nodeClickEvent = new EventEmitter<{ node: Node, isRightClick: boolean }>;
  @Output() nodeMoveEvent = new EventEmitter<Node>;

  sendClickedNode = (event) => {
    if (event.buttons === 1) {
      this.nodeClickEvent.emit({
        node: this.node,
        isRightClick: false
      });
    } else if (event.buttons === 2) {
      this.nodeClickEvent.emit({
        node: this.node,
        isRightClick: true
      });
    }
  }

  sendMovednode = (event) => {
    event.stopPropagation();
    
    if (event.buttons === 1 || event.buttons === 2) {
      this.nodeMoveEvent.emit(this.node);
    }
  }
}
