import { TestBed } from '@angular/core/testing';

import { SignalApiService } from './signal-api.service';

describe('SignalApiService', () => {
  let service: SignalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
