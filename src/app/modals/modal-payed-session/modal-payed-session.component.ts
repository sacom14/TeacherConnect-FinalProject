import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { StudentById } from '../../interfaces/student.interface';
import { SessionService } from '../../services/session/session.service';
import { StudentService } from '../../services/student/student-service.service';
import { ModalSessionDetailsComponent } from '../modal-session-details/modal-session-details.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-payed-session',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './modal-payed-session.component.html',
  styleUrl: './modal-payed-session.component.scss'
})
export class ModalPayedSessionComponent {
  private sessionService = inject(SessionService);
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);

  private router = inject(Router);

  public selectedStudentExist!: boolean;
  public selectedStudentId!: number | null;
  public sessionList!: Observable<Session[] | null>;


  constructor() {
    this.sessionList = this.sessionService.payedSessions;

  }

  ngOnInit(): void {
    this.sessionService.getAllPayedSessions();
    this.studentService.getStudentById(this.selectedStudentId);
  }

  convertToLocalDateTime(utcDate: string): string {
    return new Date(utcDate).toLocaleString();
  }


  public closeModal() {
    this.modalService.dismissAll();
  }
}
