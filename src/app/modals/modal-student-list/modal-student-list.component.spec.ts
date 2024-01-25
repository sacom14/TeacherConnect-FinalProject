import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStudentListComponent } from './modal-student-list.component';

describe('ModalStudentListComponent', () => {
  let component: ModalStudentListComponent;
  let fixture: ComponentFixture<ModalStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalStudentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
