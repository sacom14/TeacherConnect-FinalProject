import { Student, StudentWithSubjects } from './../../interfaces/student.interface';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FilterbarStudentComponent } from './filterbar-student/filterbar-student.component';
import { InfoStudentComponent } from './info-student/info-student.component';
import { Observable, map } from 'rxjs';
import { StudentService } from '../../services/student/student-service.service';
import { Subject } from '../../interfaces/subject.interface';



@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FilterbarStudentComponent, InfoStudentComponent],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.scss'
})
export class StudentPageComponent implements OnInit {
  private studentService = inject(StudentService);

  public students!: Observable<Student[]>;
  public studentsWithSubjects!: Observable< StudentWithSubjects[]>;
  public combinedStudentData!: Observable<StudentWithSubjects[]>;

  constructor() {
    this.students = this.studentService.students;
    this.studentsWithSubjects = this.studentService.studentsWithSubjects;
  }

  ngOnInit(): void {
    this.studentService.getStudentsFromTeacher();

    this.studentService.students.subscribe(students => {
      students.forEach( student => {
  //we obtain all subjects for the diferents students
        this.studentService.getSubjectsFromStudent(student.id_student);
      })
    });
  }

  //take de subjects for the concret student
  getSubjectsForStudent(studentId: number): Observable<Subject[]> {
    return this.studentsWithSubjects.pipe(
      map(studentsWithSubjectsArray => {
        const studentWithSubjects = studentsWithSubjectsArray.find(s => s.studentId === studentId);
        return studentWithSubjects ? studentWithSubjects.subjects : [];
      })
    );
  }

  //change the studentId selected info for student after click on card
  public showAllInfoForStudentIdSelected(selectedStudentId: number){
    this.studentService.changeCurrentStudentIdSelected(selectedStudentId);
  }

}

