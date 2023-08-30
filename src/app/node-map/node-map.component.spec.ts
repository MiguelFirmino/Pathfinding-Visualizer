import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeMapComponent } from './node-map.component';

describe('NodeMapComponent', () => {
  let component: NodeMapComponent;
  let fixture: ComponentFixture<NodeMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeMapComponent]
    });
    fixture = TestBed.createComponent(NodeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
