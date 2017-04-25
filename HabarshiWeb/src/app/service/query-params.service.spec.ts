import { TestBed, inject } from '@angular/core/testing';

import { QueryParamsService } from './query-params.service';

describe('QueryParamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParamsService]
    });
  });

  it('should ...', inject([QueryParamsService], (service: QueryParamsService) => {
    expect(service).toBeTruthy();
  }));
});
