/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InoutAssignService } from './inout-assign.service';

describe('InoutAssignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InoutAssignService]
    });
  });

  it('should ...', inject([InoutAssignService], (service: InoutAssignService) => {
    expect(service).toBeTruthy();
  }));
});
