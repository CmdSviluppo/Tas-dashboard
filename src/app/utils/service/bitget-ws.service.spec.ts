import { TestBed } from '@angular/core/testing';

import { BitgetWsService } from './bitget-ws.service';

describe('BitgetWsService', () => {
  let service: BitgetWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitgetWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
