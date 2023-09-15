import { TestBed } from '@angular/core/testing';

import { AStarService } from './a-star.service';

describe('AStarService', () => {
  let service: AStarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AStarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
