import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../services/confirm.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {

  private confirmService = inject(ConfirmService);
  private modalService = inject(NgbModal);


  public confirmDelete(){
    this.confirmService.confirmDelete();
    this.closeModal();
  }

  public cancelDelete(): void {
    this.confirmService.cancelDelete();
    this.closeModal();
  }

  public closeModal(): void {
    this.modalRef?.dismiss();
  }

  private modalRef: NgbModalRef | null = null;

  public setModalRef(modalRef: NgbModalRef): void {
    this.modalRef = modalRef;
  }
}
