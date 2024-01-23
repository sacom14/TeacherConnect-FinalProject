import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { StudentService } from '../../services/student/student-service.service';
import { StudentById } from '../../interfaces/student.interface';

@Component({
  selector: 'app-session-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule,],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.scss'
})
export class SessionPageComponent implements OnInit {
  private sessionService = inject(SessionService);
  private studentService = inject(StudentService);
  private activatedRoute = inject(ActivatedRoute); //we obtains the studentId from the info-page.component
  private router = inject(Router);

  public selectedStudentExist!: boolean;
  public selectedStudentId!: number | null;
  public sessionList!: Observable<Session[] | null>;
  public dataOfStudentSelected!: Observable<StudentById[] | null>;



  constructor() {
    this.sessionList = this.sessionService.sessionList;

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.selectedStudentId = +params['selectedStudentId'];
      this.sessionService.getSession(this.selectedStudentId);
      this.dataOfStudentSelected = this.studentService.currentInfoStudentSelected;

    })
  }

  goToNewSessionForm(){
    this.router.navigate(['/add-session', this.selectedStudentId]);
  }

}
