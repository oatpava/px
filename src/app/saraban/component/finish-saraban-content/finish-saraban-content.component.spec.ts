/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinishSarabanContentComponent } from './finish-saraban-content.component';

describe('FinishSarabanContentComponent', () => {
  let component: FinishSarabanContentComponent;
  let fixture: ComponentFixture<FinishSarabanContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishSarabanContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishSarabanContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
