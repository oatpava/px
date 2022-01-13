/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmsFolderUserAuthComponent } from './dms-folder-user-auth.component';

describe('DmsFolderUserAuthComponent', () => {
  let component: DmsFolderUserAuthComponent;
  let fixture: ComponentFixture<DmsFolderUserAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmsFolderUserAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsFolderUserAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
