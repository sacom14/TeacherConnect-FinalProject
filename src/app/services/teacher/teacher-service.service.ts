import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Teacher, TeacherEmailCheckResponseMessage, TeacherResponse } from '../../interfaces/teacher.interface';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { AuthTeacherService } from './auth-teacher.service';

@Injectable({
  providedIn: 'root',

})
export class TeacherService {
  private http = inject(HttpClient)
  private authTeacherService = inject (AuthTeacherService);

  private _teacherApiUrl: string = 'http://localhost:3000/api/teacher';

  private _teacherData = new BehaviorSubject<Teacher[]>([]);

  get teacherData(){
    return this._teacherData.asObservable();
  }

  public getTeacherDataById(){
    const teacherId = this.authTeacherService.getTeacherId();
    this.http.get<TeacherResponse>(`${this._teacherApiUrl}/${teacherId}`).subscribe({
      next: (response) => {
        this._teacherData.next(response.teachers);
      },
      error: (error) => {
        console.error('Error al obtener los datos de teacher');
      }
    })

  }

  //create teacher
  public createNewTeacher(teacherData: Teacher){
    return this.http.post(this._teacherApiUrl, teacherData)
    .pipe(
      catchError((error) => {
        console.error('Error en el servicio: ', error);
        return throwError(() => new Error('Error al crear el profesor'));
      })
    );
  }

  //chek if the email is already on BD
  public checkRepeatEmail(teacherEmail: string){
    return this.http.post<TeacherEmailCheckResponseMessage>(`${this._teacherApiUrl}/check-email`, {teacherEmail});
  }

  //login (take token)
  public login(teacherEmail: string, teacherPassword: string) {
    return this.http.post<{ token: string, teacherId:number }>(`${this._teacherApiUrl}/login`, {teacher_email: teacherEmail, teacher_password: teacherPassword});
  }

  public getAgeFromBirthdate(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

