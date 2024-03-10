import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Teacher } from '../../../interfaces/teacher.interface';
import { TeacherService } from '../../../services/teacher/teacher-service.service';
import { UpdateTeacherFormComponent } from '../update-teacher-form/update-teacher-form.component';

@Component({
  selector: 'app-teacher-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, UpdateTeacherFormComponent],
  templateUrl: './teacher-details.component.html',
  styleUrl: './teacher-details.component.scss'
})
export class TeacherDetailsComponent {
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  public teacherData!: Observable<Teacher[]>;

  constructor(){
    this.teacherData = this.teacherService.teacherData;
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

}
