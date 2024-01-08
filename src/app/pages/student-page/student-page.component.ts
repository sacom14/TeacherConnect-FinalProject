import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FilterbarStudentComponent } from './filterbar-student/filterbar-student.component';
import { InfoStudentComponent } from './info-student/info-student.component';
import { Observable } from 'rxjs';
import { Student } from '../../interfaces/student.interface';
import { StudentService } from '../../services/student/student-service.service';



@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FilterbarStudentComponent, InfoStudentComponent],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.scss'
})
export class StudentPageComponent implements OnInit {
  public students!: Observable<Student[]>;

  constructor(private studentService: StudentService){
    this.students = this.studentService.students;
  }

  ngOnInit(): void {
    this.studentService.getStudentsFromTeacher();
  }
  
}

