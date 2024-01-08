import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTeacherService } from '../../services/teacher/auth-teacher.service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authTeacherService = inject(AuthTeacherService);

  let userIsAuthenticated = () => {
    authTeacherService.isAuthenticated;
    return localStorage.getItem('token') ? true : false; // ejemplo simple
  };

  if(userIsAuthenticated()){ //is authenticated
    return true;
  } else {
    alert('Aún no has iniciado sesión');
    router.navigate(['/login-page']);
    return false;
  }
};


