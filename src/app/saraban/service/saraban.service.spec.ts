/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SarabanService } from './saraban.service';

describe('SarabanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SarabanService]
    });
  });

  it('should ...', inject([SarabanService], (service: SarabanService) => {
    expect(service).toBeTruthy();
  }));
});
