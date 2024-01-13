import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student-service.service';
import { Student } from '../../../interfaces/student.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule,],
  templateUrl: './info-student.component.html',
  styleUrl: './info-student.component.scss'
})
export class InfoStudentComponent implements OnInit {
  public selectedStudentExist!:boolean;
  public selectedStudentId!: number | null;
  public dataOfStudentSelected!: Observable<Student[] | null>;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.currentStudentIdSelected
    .subscribe(studentId =>{
      this.selectedStudentId = studentId;
      this.dataOfStudentSelected = this.studentService.currentInfoStudentSelected;
      this.loadStudentDetails(this.selectedStudentId);
    });
  }

  private loadStudentDetails(studentId: number | null){
    if(studentId){
      this.selectedStudentExist = true;
    } else {
      this.selectedStudentExist = false;
    }
  }
}
