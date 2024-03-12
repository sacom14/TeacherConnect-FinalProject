import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Teacher, TeacherEmailCheckResponseMessage, TeacherResponse } from '../../interfaces/teacher.interface';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { AuthTeacherService } from './auth-teacher.service';

@Injectable({
  providedIn: 'root',

})
export class TeacherService {
  private http = inject(HttpClient)
  private authTeacherService = inject(AuthTeacherService);

  private _teacherApiUrl: string = 'https://teacherconnect-backend.onrender.com/api/teacher';

  private _teacherData = new BehaviorSubject<Teacher[]>([]);

  get teacherData() {
    return this._teacherData.asObservable();
  }

  public getTeacherDataById() {
    const headers = this.authTeacherService.getHeadersWithAuthorization();
    const teacherId = this.authTeacherService.getTeacherId();
    this.http.get<TeacherResponse>(`${this._teacherApiUrl}/${teacherId}`, {headers}).subscribe({
      next: (response) => {
        this._teacherData.next(response.teachers);
      },
      error: (error) => {
        console.error('Error al obtener los datos de teacher');
      }
    })

  }

  //create teacher
  public createNewTeacher(teacherData: Teacher) {
    const headers = this.authTeacherService.getHeadersWithAuthorization();
    return this.http.post(this._teacherApiUrl, teacherData,  {headers})
      .pipe(
        catchError((error) => {
          console.error('Error en el servicio: ', error);
          return throwError(() => new Error('Error al crear el profesor'));
        })
      );
  }

  //chek if the email is already on BD
  public checkRepeatEmail(teacherEmail: string) {
    const teacherId = this.authTeacherService.getTeacherId();
    return this.http.post<TeacherEmailCheckResponseMessage>(`${this._teacherApiUrl}/check-email/${teacherId}`, { teacherEmail });
  }

  //login (take token)
  public login(teacherEmail: string, teacherPassword: string) {
    return this.http.post<{ token: string, teacherId: number }>(`${this._teacherApiUrl}/login`, { teacher_email: teacherEmail, teacher_password: teacherPassword });
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

  //-------------update-student.component---------------------
  public updateTeacher(teacherData: Teacher) {
    const headers = this.authTeacherService.getHeadersWithAuthorization();
    const teacherId = this.authTeacherService.getTeacherId();
    if (teacherId) {
      return this.http.put(`${this._teacherApiUrl}/${teacherId}`, teacherData, {headers})
        .pipe(
          catchError((error) => {
            console.error('Error en el servicio:', error);
            return throwError(() => new Error('Error al actualizar el profesor'));
          })
        );
    } else {
      return throwError(() => new Error('Id del profesor no disponible'));
    }
  }
  //delete student
  public deleteTeacher(): Observable<any> {
    const teacherId = this.authTeacherService.getTeacherId();
    if (teacherId !== null) {
      const headers = this.authTeacherService.getHeadersWithAuthorization();
      return this.http.delete(`${this._teacherApiUrl}/${teacherId}`, {headers}).pipe(
        catchError(error => {
          let errorMessage = 'Error desconocido';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
          }
          console.error(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
    } else {
      return throwError(() => new Error('teacherId no disponible'));
    }
  }
}

