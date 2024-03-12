import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { SessionService } from '../../services/session/session.service';
import { ModalSessionListComponent } from '../modal-session-list/modal-session-list.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmService } from '../../services/confirm.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-modal-session-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ToastrModule],
  templateUrl: './modal-session-details.component.html',
  styleUrl: './modal-session-details.component.scss'
})
export class ModalSessionDetailsComponent {
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private toastrService = inject(ToastrService);

  private sessionService = inject(SessionService);
  private confirmService = inject(ConfirmService);

  public selectedSessionId!: number | null;
  public sessionData!: Observable<Session[] | null>;
  public selectedStudentId!: number | null;
  public confirmDeleteElement: Observable<boolean>;


  constructor() {
    this.sessionData = this.sessionService.sessionData;
    this.confirmDeleteElement = this.confirmService.confirmDeleteElement;
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
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ModalSessionListComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.selectedStudentId = this.selectedStudentId;
  }

  public deleteSession() {
    this.openConfirmModal();
    this.confirmDeleteElement.subscribe((value: boolean) => {
      if (value) {
        this.sessionService.deleteSession(this.selectedSessionId).subscribe({
          next: (response) => {
            this, this.showSuccess();
            this.modalService.dismissAll();
          },
          error: (error) => {
            this.showError();
            console.error('Error al eliminar la sesión', error)
          },
        });
      }
    });
  }

  public openConfirmModal() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static',
    });
    (modalRef.componentInstance as ConfirmModalComponent).setModalRef(modalRef);
  }

  public closeModal() {
    this.modalService.dismissAll();
  }


  private showSuccess() {
    this.toastrService.success('Los sesión se ha eliminado correctamente!', 'Felicidades!');
  }

  private showError() {
    this.toastrService.error('Ha habido un error para elimnar la sesión', 'Ups!');
  }

}
