import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbarStudentComponent } from './filterbar-student.component';

describe('FilterbarStudentComponent', () => {
  let component: FilterbarStudentComponent;
  let fixture: ComponentFixture<FilterbarStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterbarStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterbarStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
