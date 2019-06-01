import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStructureComponent } from './add-structure.component';

describe('AddStructureComponent', () => {
  let component: AddStructureComponent;
  let fixture: ComponentFixture<AddStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
