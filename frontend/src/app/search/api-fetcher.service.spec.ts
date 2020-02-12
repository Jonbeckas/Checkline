import { TestBed } from '@angular/core/testing';

import { ApiFetcherService } from './api-fetcher.service';

describe('ApiFetcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiFetcherService = TestBed.get(ApiFetcherService);
    expect(service).toBeTruthy();
  });
});
