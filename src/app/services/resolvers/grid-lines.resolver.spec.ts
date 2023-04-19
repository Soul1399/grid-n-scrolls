import { TestBed } from '@angular/core/testing';

import { GridLinesResolver } from './grid-lines.resolver';

describe('GridLinesResolver', () => {
  let resolver: GridLinesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GridLinesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
