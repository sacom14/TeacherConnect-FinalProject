import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Session, SessionResponse } from '../../interfaces/session.interface';

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


}
