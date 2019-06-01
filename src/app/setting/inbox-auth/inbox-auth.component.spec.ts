/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InboxAuthComponent } from './inbox-auth.component';

describe('InboxAuthComponent', () => {
  let component: InboxAuthComponent;
  let fixture: ComponentFixture<InboxAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboxAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
