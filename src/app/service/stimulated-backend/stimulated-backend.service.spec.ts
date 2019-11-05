import { TestBed } from '@angular/core/testing';

import { StimulatedBackendService } from './stimulated-backend.service';

describe('StimulatedBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StimulatedBackendService = TestBed.get(StimulatedBackendService);
    expect(service).toBeTruthy();
  });
});
