import { TestBed } from '@angular/core/testing';

import { ProfileCreateService } from './profile-create.service';

describe('ProfileCreateService', () => {
  let service: ProfileCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
