import { Student, StudentWithSubjects } from './../../interfaces/student.interface';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FilterbarStudentComponent } from './filterbar-student/filterbar-student.component';
import { InfoStudentComponent } from './info-student/info-student.component';
import { Observable } from 'rxjs';
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
  public studentsWithSubjects: StudentWithSubjects[] = [];

  constructor() {
    this.students = this.studentService.students;
  }

  ngOnInit(): void {
    this.studentService.getStudentsFromTeacher();
    this.studentService.students.subscribe(students => {
      students.forEach( student => {
        this.getSubjectsFromStudent(student.id_student);
      })
    });
  }

  //we obtain all subjects for the diferents students
  getSubjectsFromStudent(studentId: number) {
    this.studentService.getTheStudentSubjects(studentId)
      .subscribe(subjectResponse => {
        this.studentsWithSubjects.push({
          studentId: studentId,
          subjects: subjectResponse.subjects
        })
      });
  }

  //take de subjects for the concret student
  getSubjectsForStudent(studentId: number): Subject[] {
    const studentWithSubjects = this.studentsWithSubjects.find(s => s.studentId === studentId);
    return studentWithSubjects ? studentWithSubjects.subjects : [];
  }

  //change the studentId selected info for student after click on card
  public showAllInfoForStudentIdSelected(selectedStudentId: number){
    this.studentService.changeCurrentStudentIdSelected(selectedStudentId);
  }

}

