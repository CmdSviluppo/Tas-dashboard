import { TestBed } from '@angular/core/testing';

import { StrategyApiService } from './strategy-api.service';

describe('StrategyApiService', () => {
  let service: StrategyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
