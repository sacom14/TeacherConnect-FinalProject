import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher, TeacherEmailCheckResponseMessage } from '../../interfaces/teacher.interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class TeacherService {

  private teacherApiUrl: string = 'http://localhost:3000/api/teacher';
  constructor(
    private http: HttpClient) { }

  //create teacher
  createNewTeacher(teacherData: Teacher){
    return this.http.post(this.teacherApiUrl, teacherData)
    .pipe(
      catchError((error) => {
        console.error('Error en el servicio: ', error);
        return throwError(() => new Error('Error al crear el profesor'));
      })
    );
  }

  //chek if the email is already on BD
  public checkRepeatEmail(teacherEmail: string){
    return this.http.post<TeacherEmailCheckResponseMessage>(`${this.teacherApiUrl}/check-email`, {teacherEmail});
  }

  //login (take token)
  public login(teacherEmail: string, teacherPassword: string) {
    return this.http.post<{ token: string }>(`${this.teacherApiUrl}/login`, {teacher_email: teacherEmail, teacher_password: teacherPassword});
  }

}
