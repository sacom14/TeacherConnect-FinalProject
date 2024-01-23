import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { StudentService } from '../../../services/student/student-service.service';
import { SubjectService } from '../../../services/subject/subject.service';
import { Router } from '@angular/router';
import { Subject } from '../../../interfaces/subject.interface';
import { StudentWithSubjects } from '../../../interfaces/student.interface';


@Component({
  selector: 'app-new-session-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './new-session-form.component.html',
  styleUrl: './new-session-form.component.scss'
})
export class NewSessionFormComponent {
  public currentStudentId!: number | null;
  public subjects!: Observable< StudentWithSubjects[]>;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private router: Router) {

    this.subjects = this.studentService.studentsWithSubjects;
  }

  public myFormSession: FormGroup = this.fb.group({
    sessionName: ['', [Validators.required]],
    sessionStart: ['', [Validators.required, Validators.pattern(this.validationService.birthdatePattern)]],
    sessionEnd: ['', [Validators.required, Validators.pattern(this.validationService.birthdatePattern)]],
    sessionObjective: ['', [Validators.required]],
    sessionTask: ['', [Validators.required]],
    fkIdStudentSubject: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.studentService.currentStudentIdSelected.subscribe()
    this.studentService.currentStudentIdSelected
      .subscribe(studentId => {
        this.currentStudentId = studentId;
        console.log('student id: ' + this.currentStudentId);
      });
    this.studentService.getPaymentMethod();
    this.studentService.getAcademicYear();
    this.subjectService.getSubject();
    console.log('subjects: ' + this.subjects);
  }

  public onSubmit(): void {
    this.myFormSession.markAllAsTouched();
    if (this.myFormSession.valid) {
      this.addNewSessionForStudent(); //todo: revisar check if some student from teacher has the same email.
    }
  };


  //take de subjects for the concret student
getSubjectsForStudent(studentId: number | null): Observable<Subject[]> {
  if (studentId !== null) {
    return this.studentService.getTheStudentSubjects(studentId).pipe(
      map(response => response.subjects) // Extrae la lista de asignaturas del response
    );
  } else {
    return of([]);
  }
}

  public isValidField(field: string) {
    return this.validationService.isValidField(this.myFormSession, field);
  };

  addNewSessionForStudent() {
  }
}
