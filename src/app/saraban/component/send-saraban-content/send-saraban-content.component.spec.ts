/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendSarabanContentComponent } from './send-saraban-content.component';

describe('SendSarabanContentComponent', () => {
  let component: SendSarabanContentComponent;
  let fixture: ComponentFixture<SendSarabanContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendSarabanContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSarabanContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
