import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { StudentService } from '../../../services/student/student-service.service';
import { StudentById } from '../../../interfaces/student.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './info-student.component.html',
  styleUrl: './info-student.component.scss'
})
export class InfoStudentComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);

  public selectedStudentExist!:boolean;
  public selectedStudentId!: number | null;
  public dataOfStudentSelected!: Observable<StudentById[] | null>;

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

  public calculateAge(birthdate: string): number {
    return this.studentService.getAgeFromBirthdate(birthdate);
  }

  public goEditStudent(){
    this.router.navigate(['/update-student']);
  }

  public goAllSessions(){
    if (this.selectedStudentId !== null) {
    this.router.navigate(['/session-page', this.selectedStudentId]);
    }
  }
}
