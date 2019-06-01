import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertLogOffComponent } from './alert-log-off.component';

describe('AlertLogOffComponent', () => {
  let component: AlertLogOffComponent;
  let fixture: ComponentFixture<AlertLogOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertLogOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertLogOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
