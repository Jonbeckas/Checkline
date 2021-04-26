import { TestBed } from '@angular/core/testing';

import { RunnerService } from './runner.service';

describe('RunnerServiceService', () => {
  let service: RunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
