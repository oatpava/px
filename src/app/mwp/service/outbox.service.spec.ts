/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OutboxService } from './outbox.service';

describe('OutboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OutboxService]
    });
  });

  it('should ...', inject([OutboxService], (service: OutboxService) => {
    expect(service).toBeTruthy();
  }));
});
