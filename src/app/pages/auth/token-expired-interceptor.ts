import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthTeacherService } from '../../services/teacher/auth-teacher.service';

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthTeacherService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === 'Token expired') {
          //todo: modal for token expires "mucho tiempo inactivo"
          this.authService.removeToken();
          this.router.navigate(['/landing-page']);
          return throwError(() => new Error('Token expired'));
        }
        return throwError(() => new Error());

      })
    );
  }
}
