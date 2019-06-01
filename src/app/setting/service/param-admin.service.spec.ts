/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParamAdminService } from './param-admin.service';

describe('ParamAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParamAdminService]
    });
  });

  it('should ...', inject([ParamAdminService], (service: ParamAdminService) => {
    expect(service).toBeTruthy();
  }));
});
