/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AssignContentService } from './assign-content.service';

describe('AssignContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignContentService]
    });
  });

  it('should ...', inject([AssignContentService], (service: AssignContentService) => {
    expect(service).toBeTruthy();
  }));
});
