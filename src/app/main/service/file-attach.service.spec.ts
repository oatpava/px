/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileAttachService } from './file-attach.service';

describe('FileAttachService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileAttachService]
    });
  });

  it('should ...', inject([FileAttachService], (service: FileAttachService) => {
    expect(service).toBeTruthy();
  }));
});
