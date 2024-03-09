import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStudentInfoComponent } from './modal-student-info.component';

describe('ModalStudentInfoComponent', () => {
  let component: ModalStudentInfoComponent;
  let fixture: ComponentFixture<ModalStudentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalStudentInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalStudentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
