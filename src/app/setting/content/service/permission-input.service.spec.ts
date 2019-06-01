/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PermissionInputService } from './permission-input.service';

describe('PermissionInputService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionInputService]
    });
  });

  it('should ...', inject([PermissionInputService], (service: PermissionInputService) => {
    expect(service).toBeTruthy();
  }));
});
