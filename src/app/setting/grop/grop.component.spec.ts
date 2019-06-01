/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GropComponent } from './grop.component';

describe('GropComponent', () => {
  let component: GropComponent;
  let fixture: ComponentFixture<GropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
