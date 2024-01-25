import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../services/student/student-service.service';
import { Observable } from 'rxjs';
import { Student } from '../../interfaces/student.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-student-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './modal-student-list.component.html',
  styleUrl: './modal-student-list.component.scss'
})
export class ModalStudentListComponent implements OnInit {
  private router = inject(Router);
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);

  public studentList!: Observable<Student[]>;

  constructor() {
    this.studentList = this.studentService.students;
  }

  ngOnInit(): void {
    this.studentService.getStudentsFromTeacher();
  }

  goToNewSessionForm(selectedStudentId: number) {
    this.modalService.dismissAll();//close the modal
    this.router.navigate(['/add-session', selectedStudentId]);
  }


}
