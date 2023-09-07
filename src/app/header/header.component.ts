import { Component, Input, OnInit } from '@angular/core';
import { NodeMapComponent } from '../node-map/node-map.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  
  @Input() nodeMapComponent: NodeMapComponent;

  sendClearMap = (): void => {
    console.log('(from header) sent map clear message');
    this.nodeMapComponent.clearMap();
  }

  sendAlgorithmStart = (): void => {
    console.log('(from header) sent request to start algorithm');
    this.nodeMapComponent.startAlgorithm();
  }

  sendAlgorithmStop = (): void => {
    console.log('(from header) sent request to stop algorithm');
    this.nodeMapComponent.stopAlgorithm();
  }  

  sendAlgorithmResume = (): void => {
    console.log('(from header) sent request to resume algorithm');
    this.nodeMapComponent.resumeAlgorithm();
  }

  sendDelayChange = (event: any): void => {
    let newDelay = parseInt(event.target.value);
    console.log(`(from header) sent request to change delay to ${newDelay}`);

    this.nodeMapComponent.changeAlgorithmDelay(newDelay);
  }

  sendAlgorithmChange = (event: any): void => {
    let newAlgorithm = event.target.value;
    console.log(`(from header) sent request to change algorithm to ${newAlgorithm}`);

    this.nodeMapComponent.changeAlgorithmService(newAlgorithm);
  }

  sendInstaToggle = (): void => {
    console.log('(from header) sent request to toggle instant vizualization.');
    
    this.nodeMapComponent.toggleInstantVisualization();
  }
}
