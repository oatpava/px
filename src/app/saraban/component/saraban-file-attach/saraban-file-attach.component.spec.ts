/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SarabanFileAttachComponent } from './saraban-file-attach.component';

describe('SarabanFileAttachComponent', () => {
  let component: SarabanFileAttachComponent;
  let fixture: ComponentFixture<SarabanFileAttachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SarabanFileAttachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SarabanFileAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
