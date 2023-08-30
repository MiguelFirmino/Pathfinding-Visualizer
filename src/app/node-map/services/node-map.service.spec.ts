import { TestBed } from '@angular/core/testing';

import { NodeMapService } from './node-map.service';

describe('NodeMapService', () => {
  let service: NodeMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
