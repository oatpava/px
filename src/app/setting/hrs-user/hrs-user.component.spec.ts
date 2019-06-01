/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HrsUserComponent } from './hrs-user.component';

describe('HrsUserComponent', () => {
  let component: HrsUserComponent;
  let fixture: ComponentFixture<HrsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
