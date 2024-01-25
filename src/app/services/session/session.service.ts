import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Session, SessionFromTeacherIDResponse, SessionFromTeacherId, SessionPost, SessionResponse } from '../../interfaces/session.interface';
import { AuthTeacherService } from '../teacher/auth-teacher.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private http = inject(HttpClient);
  private authTeacherService = inject(AuthTeacherService);

  private _sessionApiUrl: string = 'http://localhost:3000/api/session';

  private _sessionList = new BehaviorSubject<Session[]>([]);
  private _sessionListFromTeacherId = new BehaviorSubject<SessionFromTeacherId[]>([]);

  get sessionList(){
    return this._sessionList.asObservable();
  }

  get sessionListFromTeacherId(){
    return this._sessionListFromTeacherId.asObservable();
  }

  //from student Id
  public getSession(studentId: number | null){
    this.http.get<SessionResponse>(`${this._sessionApiUrl}/student/${studentId}`).subscribe({
      next: (response) => {
        this._sessionList.next(response.sessions);
      },
      error: (error) => {
        console.error('Error al recuperar las sesiones del estudiante', error);
      }
    });
  }

  //Al sessions from teacher Id
  public getAllSessionsFromTeacherId(){
    const teacherId = this.authTeacherService.getTeacherId();
    this.http.get<SessionFromTeacherIDResponse>(`${this._sessionApiUrl}/teacher/${teacherId}`).subscribe({
      next: (response) => {
        this._sessionListFromTeacherId.next(response.sessions);
      },
      error: (error) => {
        console.error('Error al recuperar las sesiones del profesor')
      }
    });
  }

  //create session
  public createNewSession(sessionData: SessionPost, fkIdStudentSubject: number) {

    if (fkIdStudentSubject && sessionData) {

      return this.http.post<SessionResponse>(`${this._sessionApiUrl}/student-subject/${fkIdStudentSubject}`, sessionData)
        .pipe(
          catchError((error) => {
            console.error('Error en el servicio:', error);
            return throwError(() => new Error('Error al crear la sesión'));
          })
        );
    } else {
      return throwError(() => new Error('FkIdStudentsubject o sessionData no disponible'));
    }
  }

}
