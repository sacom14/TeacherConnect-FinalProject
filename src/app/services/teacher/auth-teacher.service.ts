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
    public login(token: string) {
      localStorage.setItem('token', token);
      this._isAuthenticated.next(true);
    }

    // When logout for remove token from localstorage
    public removeToken() {
      localStorage.removeItem('token');
      this._isAuthenticated.next(false);
    }

}
