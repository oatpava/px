/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MwpService } from './mwp.service';

describe('MwpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MwpService]
    });
  });

  it('should ...', inject([MwpService], (service: MwpService) => {
    expect(service).toBeTruthy();
  }));
});
