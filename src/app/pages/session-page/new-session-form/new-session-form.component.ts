import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { StudentService } from '../../../services/student/student-service.service';
import { SubjectService } from '../../../services/subject/subject.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentWithSubjects } from '../../../interfaces/student.interface';
import { SessionService } from '../../../services/session/session.service';

@Component({
  selector: 'app-new-session-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './new-session-form.component.html',
  styleUrl: './new-session-form.component.scss'
})
export class NewSessionFormComponent {

  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private studentService = inject(StudentService);
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sessionService = inject(SessionService);

  public currentStudentId!: number | null;
  public subjects!: Observable<StudentWithSubjects[] | null>;

  constructor() {
    this.subjects = this.studentService.studentsWithSubjects;
  }

  public myFormSession: FormGroup = this.fb.group({
    sessionName: ['', [Validators.required]],
    sessionObjective: ['', [Validators.required]],
    sessionStart: ['', [Validators.required]],
    sessionEnd: ['', [Validators.required]],
    sessionTasks: ['', [Validators.required]],
    fkIdStudentSubject: ['', [Validators.required]],
  });

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.currentStudentId = +params['selectedStudentId'];
      this.studentService.getSubjectsForStudentId(this.currentStudentId);
    });
  }

  public onSubmit(): void {
    this.myFormSession.markAllAsTouched();
    if (this.myFormSession.valid) {
      this.addNewSessionForStudent(); //todo: revisar check if some student from teacher has the same email.
    }
  };

  public isValidField(field: string) {
    return this.validationService.isValidField(this.myFormSession, field);
  };

  addNewSessionForStudent() {
    const { fkIdStudentSubject, ...sessionFormData } = this.myFormSession.value;
    const idSudentSubject:number  = this.myFormSession.value.fkIdStudentSubject;

    this.sessionService.createNewSession(sessionFormData, idSudentSubject).subscribe({
      next: (response) => {
        alert('Se ha creado la sesión correctamente');
        //hacer que salga un modal (o alert) verde como mensaje de todo correcto!
        //redirigir al login
        this.router.navigate(['/student-page'])
      },
      error: (error) => {
        console.error('Error al crear la sesión', error)
      },
    });



  }
}
