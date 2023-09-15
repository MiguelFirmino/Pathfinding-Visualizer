import { TestBed } from '@angular/core/testing';

import { DepthFirstSearchService } from './depth-first-search.service';

describe('DepthFirstSearchService', () => {
  let service: DepthFirstSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepthFirstSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
