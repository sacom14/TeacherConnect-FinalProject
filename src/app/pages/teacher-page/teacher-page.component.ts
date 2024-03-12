import { Component, inject } from '@angular/core';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Teacher } from '../../interfaces/teacher.interface';
import { TeacherService } from '../../services/teacher/teacher-service.service';
import { UpdateTeacherFormComponent } from './update-teacher-form/update-teacher-form.component';
import { AuthTeacherService } from '../../services/teacher/auth-teacher.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { ConfirmService } from '../../services/confirm.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, UpdateTeacherFormComponent],
  templateUrl: './teacher-page.component.html',
  styleUrl: './teacher-page.component.scss'
})
export class TeacherPageComponent {
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private authTeacherService = inject(AuthTeacherService);
  private toastrService = inject(ToastrService);
  private confirmService = inject(ConfirmService);

  public teacherData!: Observable<Teacher[]>;
  public confirmDeleteElement: Observable<boolean>;

  constructor(){
    this.teacherData = this.teacherService.teacherData;
    this.confirmDeleteElement = this.confirmService.confirmDeleteElement;
  }


  ngOnInit(): void {
    this.teacherService.getTeacherDataById();
  }

  public calculateAge(birthdate: string): number {
    return this.teacherService.getAgeFromBirthdate(birthdate);
  }

  public goEditTeacher() {
    this.router.navigate(['/update-teacher']);
  }

  public deleteTeacher(){
    this.openConfirmModal();
    this.confirmDeleteElement.subscribe((value:boolean) =>{
      if(value){
        this.teacherService.deleteTeacher().subscribe({
          next: (response) => {
            this.showSuccess();
            this.logout();
          },
          error: (error) => {
            this.showError()
            console.error('Error al eliminar la cuenta de profesor', error)
          },
        });
      }
    });
  }

  logout() {
    this.authTeacherService.removeToken();
    this.router.navigate(['/landing-page']);
  }

  public openConfirmModal() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static',
    });
    (modalRef.componentInstance as ConfirmModalComponent).setModalRef(modalRef);
  }

  private showSuccess() {
    this.toastrService.success('La cuenta de profesor se ha eliminado correctamente', 'Felicidades!');
  }

  private showError() {
    this.toastrService.error('Error al eliminar la cuenta de profesor', 'Ups!');
  }
}
