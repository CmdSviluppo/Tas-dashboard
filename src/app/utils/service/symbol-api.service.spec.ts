import {TestBed} from '@angular/core/testing';

import {SymbolApiService} from './symbol-api.service';

describe('SymbolApiService', () => {
  let service: SymbolApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SymbolApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
