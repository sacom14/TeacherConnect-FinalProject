import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Session, SessionPost, SessionResponse } from '../../interfaces/session.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private http = inject(HttpClient);

  private _sessionApiUrl: string = 'http://localhost:3000/api/session';

  private _sessionList = new BehaviorSubject<Session[]>([]);

  get sessionList(){
    return this._sessionList.asObservable();
  }

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

  //create session
  public createNewSession(sessionData: SessionPost, fkIdStudentSubject: number) {
    console.log('hola: ', fkIdStudentSubject)
    console.log('hola: ', sessionData)

    if (fkIdStudentSubject && sessionData) {
      console.log('esta llegando aquí; ', fkIdStudentSubject)
      console.log('esta llegando aquí; ', sessionData)

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
