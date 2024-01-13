import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Teacher, TeacherEmailCheckResponseMessage } from '../../interfaces/teacher.interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class TeacherService {
  private http = inject(HttpClient)

  private _teacherApiUrl: string = 'http://localhost:3000/api/teacher';
  
  //create teacher
  createNewTeacher(teacherData: Teacher){
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

}
