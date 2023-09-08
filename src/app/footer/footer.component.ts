import { Component, Input } from '@angular/core';
import { NodeMapComponent } from '../node-map/node-map.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  @Input() nodeMapComponent: NodeMapComponent;

  getMessage(): string {
    let finishReason = this.nodeMapComponent.algorithmService?.checkIfDone().reason;
    let iterationCount = this.nodeMapComponent.algorithmService.iterationCount;

    if (this.nodeMapComponent.isAlgorithmOperating) {
      return 'Visualization in progress...';
    } else if (finishReason == "reached end") {
      return `Reached end after ${iterationCount} iterations.`;
    } else if (finishReason == "no solution") {
      return `No solution was found after ${iterationCount} iterations.`;
    } else {
      return 'Algorithm is Idle';
    }
  }
}
