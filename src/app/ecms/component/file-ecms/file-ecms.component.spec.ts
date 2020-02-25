/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FileEcmsComponent } from './file-ecms.component';

describe('FileEcmsComponent', () => {
  let component: FileEcmsComponent;
  let fixture: ComponentFixture<FileEcmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileEcmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileEcmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
