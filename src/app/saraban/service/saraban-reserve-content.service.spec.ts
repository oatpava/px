/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SarabanReserveContentService } from './saraban-reserve-content.service';

describe('SarabanReserveContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SarabanReserveContentService]
    });
  });

  it('should ...', inject([SarabanReserveContentService], (service: SarabanReserveContentService) => {
    expect(service).toBeTruthy();
  }));
});
