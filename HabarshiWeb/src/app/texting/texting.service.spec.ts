import { TestBed, inject } from '@angular/core/testing';

import { TextingService } from './texting.service';

describe('TextingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextingService]
    });
  });

  it('should ...', inject([TextingService], (service: TextingService) => {
    expect(service).toBeTruthy();
  }));
});
