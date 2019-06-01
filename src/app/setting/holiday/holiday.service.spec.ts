/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HolidayService } from './holiday.service';

describe('HolidayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolidayService]
    });
  });

  it('should ...', inject([HolidayService], (service: HolidayService) => {
    expect(service).toBeTruthy();
  }));
});
