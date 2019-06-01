/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SarabanContentTypeService } from './saraban-content-type.service';

describe('SarabanContentTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SarabanContentTypeService]
    });
  });

  it('should ...', inject([SarabanContentTypeService], (service: SarabanContentTypeService) => {
    expect(service).toBeTruthy();
  }));
});
