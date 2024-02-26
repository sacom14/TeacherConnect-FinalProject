import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTeacherService } from '../../services/teacher/auth-teacher.service';


export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authTeacherService = inject(AuthTeacherService);

  let userIsAuthenticated = () => {
    authTeacherService.isAuthenticated;
    return localStorage.getItem('token') ? true : false;
  };

  if(userIsAuthenticated()){ //is authenticated
    alert('Ya estas iniciado sesión, no puedes ir a esta página');
    router.navigate(['/home-page']);

    return false;
  } else {
    return true;
  }
};

