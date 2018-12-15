import {TestBed} from '@angular/core/testing';

import {NodeRestService} from './node-rest.service';

describe('NodeRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeRestService = TestBed.get(NodeRestService);
    expect(service).toBeTruthy();
  });
});
