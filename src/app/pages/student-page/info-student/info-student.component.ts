import { ConfirmService } from './../../../services/confirm.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { StudentService } from '../../../services/student/student-service.service';
import { StudentById } from '../../../interfaces/student.interface';
import { Observable } from 'rxjs';
import { Router, provideRouter } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSessionListComponent } from '../../../modals/modal-session-list/modal-session-list.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-info-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ToastrModule],
  templateUrl: './info-student.component.html',
  styleUrl: './info-student.component.scss'
})
export class InfoStudentComponent implements OnInit {
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private toastrService = inject(ToastrService);
  private confirmService = inject(ConfirmService);

  public selectedStudentExist!: boolean;
  public selectedStudentId!: number | null;
  public dataOfStudentSelected!: Observable<StudentById[] | null>;
  public confirmDeleteElement: Observable<boolean>;

  constructor() {
    this.confirmDeleteElement = this.confirmService.confirmDeleteElement;
  }

  ngOnInit(): void {
    this.studentService.currentStudentIdSelected
      .subscribe(studentId => {
        this.selectedStudentId = studentId;
        this.dataOfStudentSelected = this.studentService.currentInfoStudentSelected;
        this.loadStudentDetails(this.selectedStudentId);

      });
  }

  private loadStudentDetails(studentId: number | null) {
    if (studentId) {
      this.selectedStudentExist = true;
    } else {
      this.selectedStudentExist = false;
    }
  }

  public calculateAge(birthdate: string): number {
    return this.studentService.getAgeFromBirthdate(birthdate);
  }

  public goEditStudent() { //todo: CAMBIAR POR MODAL?
    this.modalService.dismissAll();
    this.router.navigate(['/update-student']);
  }

  public openSessionListModal(selectedStudenId: number) {
    const modalRef = this.modalService.open(ModalSessionListComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.selectedStudentId = selectedStudenId;
  }

  public deleteStudent() {
    this.openConfirmModal();
    this.confirmDeleteElement.subscribe((value: boolean) => {
      if (value) {
        this.studentService.deleteStudent(this.selectedStudentId).subscribe({
          next: (response) => {
            this.showSuccess();
            window.location.reload();
          },
          error: (error) => {
            this.showError();
            console.error('Error al eliminar el estudiante', error)
          },
        })
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

  private showSuccess() {
    this.toastrService.success('Estudiante eliminado correctamente!', 'Felicidades!');
  }

  private showError() {
    this.toastrService.error('Ha habido un error para eliminar el estudiante', 'Ups!');
  }
}
