import { TestBed } from '@angular/core/testing';

import { Typewriter } from './typewriter';

describe('Typewriter', () => {
  let service: Typewriter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Typewriter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
