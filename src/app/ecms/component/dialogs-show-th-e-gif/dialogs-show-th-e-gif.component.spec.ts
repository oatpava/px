import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsShowThEGifComponent } from './dialogs-show-th-e-gif.component';

describe('DialogsShowThEGifComponent', () => {
  let component: DialogsShowThEGifComponent;
  let fixture: ComponentFixture<DialogsShowThEGifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsShowThEGifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsShowThEGifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
