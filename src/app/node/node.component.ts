import { Component, Input, OnInit } from '@angular/core';
import { Node } from './node';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input() node!: Node;

  constructor() { }

  ngOnInit() {
    // console.log("A node was initialized");
  }

  logClick() {
    console.log(`A node was clicked at ${this.node.xPosition}, ${this.node.yPosition}`);
  }
}
