/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SarabanContentService } from './saraban-content.service';

describe('SarabanContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SarabanContentService]
    });
  });

  it('should ...', inject([SarabanContentService], (service: SarabanContentService) => {
    expect(service).toBeTruthy();
  }));
});
