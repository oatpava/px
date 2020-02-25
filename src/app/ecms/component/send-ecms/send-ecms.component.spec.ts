/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendEcmsComponent } from './send-ecms.component';

describe('SendEcmsComponent', () => {
  let component: SendEcmsComponent;
  let fixture: ComponentFixture<SendEcmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEcmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEcmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
