import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../services/student/student-service.service';
import { Observable } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { SessionService } from '../../services/session/session.service';
import { ModalSessionListComponent } from '../modal-session-list/modal-session-list.component';

@Component({
  selector: 'app-modal-session-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './modal-session-details.component.html',
  styleUrl: './modal-session-details.component.scss'
})
export class ModalSessionDetailsComponent {
  private router = inject(Router);
  private studentService = inject(StudentService); //todo: revisra si es necesario
  private modalService = inject(NgbModal);

  private sessionService = inject(SessionService);
  private activatedRoute = inject(ActivatedRoute); //we obtains the studentId from the info-page.component //todo: revisra si es necesario

  // public selectedSessionExist!: boolean;
  public selectedSessionId!: number | null;
  public sessionData!: Observable<Session[] | null>;
  public selectedStudentId!:number | null;

  constructor() {
    this.sessionData = this.sessionService.sessionData;
  }

  ngOnInit(): void {
    if (this.selectedSessionId) {
      this.sessionService.getSessionDataFromSessionId(this.selectedSessionId);
    }
  }

  convertToLocalDateTime(utcDate: string): string {
    return new Date(utcDate).toLocaleString();
  }

  goToEditSessionForm() {
    this.modalService.dismissAll();//close the modal
    this.router.navigate(['/edit-session', this.selectedSessionId, this.selectedStudentId]);
  }

  public openStudentListModal() {
    const modalRef = this.modalService.open(ModalSessionListComponent, {
      centered: true,
    });
    modalRef.componentInstance.selectedStudentId = this.selectedStudentId;
  }

}
