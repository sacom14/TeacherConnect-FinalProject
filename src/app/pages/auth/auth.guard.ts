import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTeacherService } from '../../services/teacher/auth-teacher.service';
import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastrService = inject(ToastrService);
  const authTeacherService = inject(AuthTeacherService);

  let userIsAuthenticated = () => {
    authTeacherService.isAuthenticated;
    return localStorage.getItem('token') ? true : false;
  };

  if(userIsAuthenticated()){ //is authenticated
    return true;
  } else {
    toastrService.warning('Primero debes iniciar sesión')
    router.navigate(['/login-page']);
    return false;
  }

};


