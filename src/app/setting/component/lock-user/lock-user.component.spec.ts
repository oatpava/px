/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LockUserComponent } from './lock-user.component';

describe('LockUserComponent', () => {
  let component: LockUserComponent;
  let fixture: ComponentFixture<LockUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
