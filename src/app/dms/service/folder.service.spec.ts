/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FolderService } from './folder.service';

describe('FolderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FolderService]
    });
  });

  it('should ...', inject([FolderService], (service: FolderService) => {
    expect(service).toBeTruthy();
  }));
});
