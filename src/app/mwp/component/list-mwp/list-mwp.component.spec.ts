/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListMwpComponent } from './list-mwp.component';

describe('ListMwpComponent', () => {
  let component: ListMwpComponent;
  let fixture: ComponentFixture<ListMwpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMwpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
