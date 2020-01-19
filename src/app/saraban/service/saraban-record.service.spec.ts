/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SarabanRecordService } from './saraban-record.service';

describe('SarabanRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SarabanRecordService]
    });
  });

  it('should ...', inject([SarabanRecordService], (service: SarabanRecordService) => {
    expect(service).toBeTruthy();
  }));
});
