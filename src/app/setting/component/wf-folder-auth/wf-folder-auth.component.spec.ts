/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WfFolderAuthComponent } from './wf-folder-auth.component';

describe('WfFolderAuthComponent', () => {
  let component: WfFolderAuthComponent;
  let fixture: ComponentFixture<WfFolderAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfFolderAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfFolderAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
