/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HrsComponent } from './hrs.component';

describe('HrsComponent', () => {
  let component: HrsComponent;
  let fixture: ComponentFixture<HrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
