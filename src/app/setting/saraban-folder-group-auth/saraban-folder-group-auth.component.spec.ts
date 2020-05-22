/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SarabanFolderGroupAuthComponent } from './saraban-folder-group-auth.component';

describe('SarabanFolderGroupAuthComponent', () => {
  let component: SarabanFolderGroupAuthComponent;
  let fixture: ComponentFixture<SarabanFolderGroupAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SarabanFolderGroupAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SarabanFolderGroupAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
