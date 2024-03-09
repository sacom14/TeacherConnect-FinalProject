import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { StudentById } from '../../interfaces/student.interface';
import { SessionService } from '../../services/session/session.service';
import { StudentService } from '../../services/student/student-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSessionDetailsComponent } from '../modal-session-details/modal-session-details.component';

@Component({
  selector: 'app-modal-session-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './modal-session-list.component.html',
  styleUrl: './modal-session-list.component.scss'
})
export class ModalSessionListComponent {
  private sessionService = inject(SessionService);
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);

  private router = inject(Router); //Todo quitar?

  public selectedStudentExist!: boolean; //Todo quitar?
  public selectedStudentId!: number | null;
  public sessionList!: Observable<Session[] | null>;
  public dataOfStudentSelected!: Observable<StudentById[] | null>;

  constructor() {
    this.sessionList = this.sessionService.sessionList;
    this.dataOfStudentSelected = this.studentService.currentInfoStudentSelected;
  }

  ngOnInit(): void {
    this.sessionService.getSession(this.selectedStudentId);
    this.studentService.getStudentById(this.selectedStudentId);
  }

  convertToLocalDateTime(utcDate: string): string {
    return new Date(utcDate).toLocaleString();
  }

  goToNewSessionForm() {
    this.modalService.dismissAll();
    this.router.navigate(['/add-session', this.selectedStudentId]);
  }

  public openSessionDetailsModal(selectedSessionId: number) {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ModalSessionDetailsComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.selectedSessionId = selectedSessionId; //get the id_session from selected session
    modalRef.componentInstance.selectedStudentId = this.selectedStudentId;
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

}
