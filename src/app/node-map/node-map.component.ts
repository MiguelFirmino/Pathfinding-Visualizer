import { Component } from '@angular/core';
import { NodeMapService } from './services/node-map.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-node-map',
  templateUrl: './node-map.component.html',
  styleUrls: ['./node-map.component.scss']
})
export class NodeMapComponent {

  constructor (private nodeMapService: NodeMapService) { }  

   // Standard size
  mapWidth: number = 10;
  mapHeight: number = 10;
  nodeMap = this.nodeMapService.generateMap(this.mapWidth, this.mapHeight);
  
  setSize(newWidth: number, newHeight: number) {
    console.log("(from node-map) received map size");
    this.mapWidth = newWidth;
    this.mapHeight = newHeight;
    this.nodeMap = this.nodeMapService.generateMap(this.mapWidth, this.mapHeight);
  }
}
