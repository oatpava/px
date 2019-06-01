/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecycleBinService } from './recycleBin.service';

describe('RecycleBinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecycleBinService]
    });
  });

  it('should ...', inject([RecycleBinService], (service: RecycleBinService) => {
    expect(service).toBeTruthy();
  }));
});
