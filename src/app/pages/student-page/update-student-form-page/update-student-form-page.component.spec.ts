import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentFormPageComponent } from './update-student-form-page.component';

describe('UpdateStudentFormPageComponent', () => {
  let component: UpdateStudentFormPageComponent;
  let fixture: ComponentFixture<UpdateStudentFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStudentFormPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateStudentFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
