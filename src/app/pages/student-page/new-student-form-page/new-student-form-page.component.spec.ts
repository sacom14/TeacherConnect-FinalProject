import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudentFormPageComponent } from './new-student-form-page.component';

describe('NewStudentFormPageComponent', () => {
  let component: NewStudentFormPageComponent;
  let fixture: ComponentFixture<NewStudentFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStudentFormPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewStudentFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
