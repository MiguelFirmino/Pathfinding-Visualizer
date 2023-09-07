import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Node } from './node';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input() node: Node;

  @Output() nodeClickEvent = new EventEmitter<Node>;
  @Output() nodeMoveEvent = new EventEmitter<Node>;

  constructor(private detector: ChangeDetectorRef) {}

  sendClickedNode = () => {
    this.nodeClickEvent.emit(this.node);
  }

  sendMovednode = (event) => {
    event.stopPropagation();
    if (event.buttons === 1) {
      console.log(`mouse moved over node at x: ${this.node.xPosition}, y: ${this.node.yPosition}`);
      this.nodeMoveEvent.emit(this.node);
    }
  }
}
