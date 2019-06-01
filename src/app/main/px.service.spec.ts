/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PxService } from './px.service';

describe('PxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PxService]
    });
  });

  it('should ...', inject([PxService], (service: PxService) => {
    expect(service).toBeTruthy();
  }));
});
