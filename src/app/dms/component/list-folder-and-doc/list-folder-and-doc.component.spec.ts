/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListFolderAndDocComponent } from './list-folder-and-doc.component';

describe('ListFolderAndDocComponent', () => {
  let component: ListFolderAndDocComponent;
  let fixture: ComponentFixture<ListFolderAndDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFolderAndDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFolderAndDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
