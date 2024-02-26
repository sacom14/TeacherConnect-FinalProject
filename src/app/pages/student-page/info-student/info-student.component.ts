import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { StudentService } from '../../../services/student/student-service.service';
import { StudentById } from '../../../interfaces/student.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSessionListComponent } from '../../../modals/modal-session-list/modal-session-list.component';

@Component({
  selector: 'app-info-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './info-student.component.html',
  styleUrl: './info-student.component.scss'
})
export class InfoStudentComponent implements OnInit {
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

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
    const modalRef = this.modalService.open(ModalSessionListComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.selectedStudentId = selectedStudenId;
  }

  // public goAllSessions(){
  //   if (this.selectedStudentId !== null) {
  //   this.router.navigate(['/session-page', this.selectedStudentId]);
  //   }
  // }
}
