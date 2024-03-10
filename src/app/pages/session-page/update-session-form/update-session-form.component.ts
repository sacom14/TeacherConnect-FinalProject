import { EventClickArg, CalendarOptions } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentWithSubjects } from '../../../interfaces/student.interface';
import { SessionService } from '../../../services/session/session.service';
import { StudentService } from '../../../services/student/student-service.service';
import { SubjectService } from '../../../services/subject/subject.service';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { Session } from '../../../interfaces/session.interface';

@Component({
  selector: 'app-update-session-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './update-session-form.component.html',
  styleUrl: './update-session-form.component.scss'
})
export class UpdateSessionFormComponent {

  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private studentService = inject(StudentService);
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sessionService = inject(SessionService);

  public selectedSessionId!: number | null;
  public selectedStudentId!:number | null;
  public session!: Observable<Session[] | null>
  public subjects!: Observable<StudentWithSubjects[] | null>;
  public fkIdStudentSubject!: number | null;

  constructor() {
    // this.subjects = this.studentService.studentsWithSubjects; //todo: no hace falta?
    this.session = this.sessionService.sessionData;
    this.subjects = this.studentService.studentsWithSubjects;
  }

  public updateSessionForm: FormGroup = this.fb.group({
    sessionName: ['', [Validators.required]],
    sessionObjective: ['', [Validators.required]],
    sessionStart: ['', [Validators.required]],
    sessionEnd: ['', [Validators.required]],
    sessionTasks: ['', [Validators.required]],
    sessionMaterial: [''],
    sessionPayed:['', Validators.required],
    fkIdStudentSubject: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.selectedSessionId = +params['selectedSessionId'];
      this.selectedStudentId = +params['selectedStudentId'];
      this.sessionService.getSessionDataFromSessionId(this.selectedSessionId);
      this.studentService.getSubjectsForStudentId(this.selectedStudentId);
      this.setInputInitialValues()
    });
  }

  public onSubmit(): void {
    this.updateSessionForm.markAllAsTouched();
    if (this.updateSessionForm.valid) {
      this.addNewSessionForStudent();
    }
  };

  public isValidField(field: string) {
    return this.validationService.isValidField(this.updateSessionForm, field);
  };

  public setInputInitialValues() {
    this.session.subscribe(data => {
      if (data && data.length > 0) {
        const sessionData = data[0];
        const formatSessionStart = this.formatDate(sessionData.session_start);
        const formatSessionEnd = this.formatDate(sessionData.session_end);
        const formatSessionPayed = this.formatSessionPayed(sessionData.session_payed.data)

        this.updateSessionForm.patchValue({
          sessionName: sessionData.session_name || '',
          sessionObjective: sessionData.session_objective || '',
          sessionStart: formatSessionStart || '',
          sessionEnd: formatSessionEnd || '',
          sessionTasks: sessionData.session_tasks || '',
          sessionMaterial: sessionData.session_material || '',
          sessionPayed: formatSessionPayed || false,
          fkIdStudentSubject: sessionData.fk_id_student_subject || '',
        });
      }
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private formatSessionPayed(sessionPayed: number[]):boolean{
    if(sessionPayed[0] == 0){
      return false;
    } else {
      return true;
    }
  }
  addNewSessionForStudent() {
    const sessionFormData = this.updateSessionForm.value;
    const sessionId = this.selectedSessionId;
    this.sessionService.updateSession(sessionFormData, sessionId).subscribe({
      next: (response) => {
        alert('Se ha actualizado la sesión correctamente');
        //todo: hacer que salga un modal (o alert) verde como mensaje de todo correcto!
        this.router.navigate(['/student-page'])
      },
      error: (error) => {
        console.error('Error al actualizar la sesión', error)
      },
    });
  }
}
