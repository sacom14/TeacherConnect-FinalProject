import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { StudentById } from '../../interfaces/student.interface';
import { StudentService } from '../../services/student/student-service.service';
import { ModalSessionListComponent } from '../modal-session-list/modal-session-list.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-student-info',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ToastrModule],
  templateUrl: './modal-student-info.component.html',
  styleUrl: './modal-student-info.component.scss'
})
export class ModalStudentInfoComponent {
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  public selectedStudentExist!: boolean;
  public selectedStudentId!: number | null;
  public dataOfStudentSelected!: Observable<StudentById[] | null>;

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
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ModalSessionListComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.selectedStudentId = selectedStudenId;
  }

  public closeModal(){
    this.modalService.dismissAll();
  }

  public deleteStudent(){
    this.studentService.deleteStudent(this.selectedStudentId).subscribe({
      next: (response) => {
        this.showSuccess();//todo: need confirm delete
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.showError();
        console.error('Error al eliminar el estudiante', error)
      },
    })
  }

  private showSuccess() {
    this.toastrService.success('Estudiante eliminado correctamente!', 'Felicidades!');
  }

  private showError(){
    this.toastrService.error('Ha habido un error para eliminar el estudiante', 'Ups!');
  }

}
