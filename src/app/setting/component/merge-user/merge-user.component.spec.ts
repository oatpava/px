/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MergeUserComponent } from './merge-user.component';

describe('MergeUserComponent', () => {
  let component: MergeUserComponent;
  let fixture: ComponentFixture<MergeUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
