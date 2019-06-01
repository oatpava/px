/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MwpComponent } from './mwp.component';

describe('MwpComponent', () => {
  let component: MwpComponent;
  let fixture: ComponentFixture<MwpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MwpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
