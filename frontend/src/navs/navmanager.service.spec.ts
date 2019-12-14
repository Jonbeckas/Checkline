import { TestBed } from '@angular/core/testing';

import { NavmanagerService } from './navmanager.service';

describe('NavmanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavmanagerService = TestBed.get(NavmanagerService);
    expect(service).toBeTruthy();
  });
});
