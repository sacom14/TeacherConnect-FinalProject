import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Session, SessionFromTeacherIDResponse, SessionFromTeacherId, SessionPost, SessionPut, SessionResponse } from '../../interfaces/session.interface';
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
  private _payedSessions = new BehaviorSubject<Session[]>([]);
  private _notPayedSessions = new BehaviorSubject<Session[]>([]);
  private _sessionData = new BehaviorSubject<Session[]>([]);

  get sessionList() {
    return this._sessionList.asObservable();
  }

  get sessionListFromTeacherId() {
    return this._sessionListFromTeacherId.asObservable();
  }

  get sessionData() {
    return this._sessionData.asObservable();
  }

  get payedSessions() {
    return this._payedSessions.asObservable();
  }

  get notPayedSessions() {
    return this._notPayedSessions.asObservable();
  }

  //from student Id
  public getSession(studentId: number | null) {
    this.http.get<SessionResponse>(`${this._sessionApiUrl}/student/${studentId}`).subscribe({
      next: (response) => {
        this._sessionList.next(response.sessions);
      },
      error: (error) => {
        console.error('Error al recuperar las sesiones del estudiante', error);
      }
    });
  }

  //get session info from sessionId
  public getSessionDataFromSessionId(sessionId: number | null) {
    if (sessionId) {
      this.http.get<SessionResponse>(`${this._sessionApiUrl}/${sessionId}`).subscribe({
        next: (response) => {
          this._sessionData.next(response.sessions);
        },
        error: (error) => {
          console.error('Error al recuperar las información de la sesión', error);
        }
      });
    } else {
      console.error('No se ha encontrado la Id se la sesión');
    }
  }

  //Al sessions from teacher Id
  public getAllSessionsFromTeacherId() {
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

  //get payed session TRUE and FALSE
  public getAllPayedSessions() {
    const teacherId = this.authTeacherService.getTeacherId();
    return this.http.get<SessionResponse>(`${this._sessionApiUrl}/session-payed/${teacherId}`).subscribe({
      next: (response) => {
        this._payedSessions.next(response.sessions);
      },
      error: (error) => {
        console.error('Error al recuperar las sesiones pagadas')
      }
    });
  }

  //get payed session TRUE and FALSE
  public getAllNotPayedSessions() {
    const teacherId = this.authTeacherService.getTeacherId();
    this.http.get<SessionResponse>(`${this._sessionApiUrl}/session-payed/${teacherId}`).subscribe({
      next: (response) => {
        this._notPayedSessions.next(response.sessions);
      },
      error: (error) => {
        console.error('Error al recuperar las sesiones pagadas')
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

  //update session
  public updateSession(sessionData: SessionPut, sessionId: number | null) {
    if (sessionId && sessionData) {
      return this.http.put<SessionResponse>(`${this._sessionApiUrl}/${sessionId}`, sessionData)
        .pipe(
          catchError((error) => {
            console.error('Error en el servicio:', error);
            return throwError(() => new Error('Error al actualizar la sesión'));
          })
        );
    } else {
      return throwError(() => new Error('SesionId o sessionData no disponibles'));
    }
  }



}
