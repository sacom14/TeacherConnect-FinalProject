import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeacherFormComponent } from './update-teacher-form.component';

describe('UpdateTeacherFormComponent', () => {
  let component: UpdateTeacherFormComponent;
  let fixture: ComponentFixture<UpdateTeacherFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTeacherFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTeacherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
