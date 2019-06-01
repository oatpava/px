import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileAttachComponent } from './upload-file-attach.component';

describe('UploadFileAttachComponent', () => {
  let component: UploadFileAttachComponent;
  let fixture: ComponentFixture<UploadFileAttachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileAttachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
