/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReserveSarabanContentCancelComponent } from './reserve-saraban-content-cancel.component';

describe('ReserveSarabanContentCancelComponent', () => {
  let component: ReserveSarabanContentCancelComponent;
  let fixture: ComponentFixture<ReserveSarabanContentCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveSarabanContentCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveSarabanContentCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
