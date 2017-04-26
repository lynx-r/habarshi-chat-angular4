import { TestBed, inject } from '@angular/core/testing';

import { UsersServiceService } from './roster.service';

describe('UsersServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersServiceService]
    });
  });

  it('should ...', inject([UsersServiceService], (service: UsersServiceService) => {
    expect(service).toBeTruthy();
  }));
});
