import { Student, StudentWithSubjects } from './../../interfaces/student.interface';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { InfoStudentComponent } from './info-student/info-student.component';
import { Observable, map } from 'rxjs';
import { StudentService } from '../../services/student/student-service.service';
import { Subject } from '../../interfaces/subject.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalStudentInfoComponent } from '../../modals/modal-student-info/modal-student-info.component';



@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, InfoStudentComponent, ModalStudentInfoComponent],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.scss'
})
export class StudentPageComponent implements OnInit {
  private studentService = inject(StudentService);
  private modalService = inject(NgbModal);

  public students!: Observable<Student[]>;
  public studentsWithSubjects!: Observable<StudentWithSubjects[]>;
  public combinedStudentData!: Observable<StudentWithSubjects[]>;
  public studentSelected: boolean = false;

  constructor() {
    this.students = this.studentService.students;
    this.studentsWithSubjects = this.studentService.studentsWithSubjects;
  }

  ngOnInit(): void {
    this.studentService.getStudentsFromTeacher();
    this.studentService.students.subscribe(students => {
      if (students && students.length > 0) {
        students.forEach(student => {
          //we obtain all subjects for the diferents students
          this.studentService.getSubjectsFromStudent(student.id_student);
        })
      }
    });
  }

  //take de subjects for the concret student
  getSubjectsForStudent(studentId: number | null): Observable<Subject[]> {
    return this.studentsWithSubjects.pipe(
      map(studentsWithSubjectsArray => {
        const studentWithSubjects = studentsWithSubjectsArray.find(s => s.studentId === studentId);
        return studentWithSubjects ? studentWithSubjects.subjects : [];
      })
    );
  }

  //change the studentId selected info for student after click on card
  public showAllInfoForStudentIdSelected(selectedStudentId: number) {
    this.studentSelected = true;
    this.studentService.changeCurrentStudentIdSelected(selectedStudentId);

    const asideElement = document.getElementById('infoStudentAside');

    const windowWidth = window.innerWidth;

    const mdBreakpoint = 768; //bootstrap mediaquery for "md"

    if (asideElement && windowWidth < mdBreakpoint || asideElement == null && windowWidth < mdBreakpoint) {
      this.openStudentInfoModal(selectedStudentId);
    }
  }

  public openStudentInfoModal(selectedStudenId: number) {
    const modalRef = this.modalService.open(ModalStudentInfoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md',
    });
    modalRef.componentInstance.selectedStudentId = selectedStudenId;
  }


}

