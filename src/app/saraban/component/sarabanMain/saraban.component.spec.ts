/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SarabanComponent } from './saraban.component';

describe('SarabanComponent', () => {
  let component: SarabanComponent;
  let fixture: ComponentFixture<SarabanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SarabanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SarabanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
