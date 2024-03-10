import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthTeacherService {
  // BehaviorSubject para mantener el estado de autenticación
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  public isAuthenticated = this._isAuthenticated.asObservable();
  constructor() {
    this.checkAuthentication();
  }

  // Verifica si el usuario está autenticado al buscar un token en localStorage
  private checkAuthentication() {
    const token = localStorage.getItem('token');
    this._isAuthenticated.next(!!token); // Emit the new state
  }

  // after login we put the token on localstorage
  public login(token: string, teacherId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('teacherId', teacherId.toString());
    this._isAuthenticated.next(true);
  }

  public getHeadersWithAuthorization(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // When logout for remove token from localstorage
  public removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('teacherId');
    this._isAuthenticated.next(false);
  }

  //get the teacherId
  public getTeacherId(): number | null {
    const teacherId = localStorage.getItem('teacherId');
    return teacherId ? parseInt(teacherId) : null;
  }


}
