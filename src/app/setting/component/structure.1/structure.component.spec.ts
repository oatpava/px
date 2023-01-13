import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureComponent } from './structure.component';

describe('StructureComponent', () => {
  let component: StructureComponent;
  let fixture: ComponentFixture<StructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});