/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HistoryLogService } from './history-log.service';

describe('HistoryLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryLogService]
    });
  });

  it('should ...', inject([HistoryLogService], (service: HistoryLogService) => {
    expect(service).toBeTruthy();
  }));
});
