import { Component, Input } from '@angular/core';
import { NodeMapComponent } from '../node-map/node-map.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  
  @Input() nodeMapComponent: NodeMapComponent;

  width: number = 10;
  height: number = 10;

  setWidth = (event: any) => { this.width = parseInt(event.target.value); }
  setHeight = (event: any) => { this.height = parseInt(event.target.value); }

  sendMapSize = () => {
    console.log(`(from header) sent height:${this.width}, width:${this.height}`)
    this.nodeMapComponent.setMapSize(this.width, this.height);
  }

  sendNodeFunction = (type: string) => {
    console.log(`(from header) sent function:${type}`)
    this.nodeMapComponent.setNodeFunction(type);
  }

  sendAlgorithmStart = () => {
    console.log(`(from header) sent request to start algorithm`);
    this.nodeMapComponent.doAlgorithmIteration();
  }
}
