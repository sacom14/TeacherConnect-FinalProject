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
  private authTeacherService = inject(AuthTeacherService);

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

  public deleteTeacher(){
    this.teacherService.deleteTeacher().subscribe({
      next: (response) => {
        alert('La cuenta de profesor se ha eliminado correctamente'); //todo: modal de notificación successfull
        this.logout();
      },
      error: (error) => {
        console.error('Error al eliminar la cuenta de profesor', error)
      },
    })
  }

  logout() {
    this.authTeacherService.removeToken();
    this.router.navigate(['/landing-page']);
  }
}
