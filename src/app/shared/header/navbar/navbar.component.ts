import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTeacherService } from '../../../services/teacher/auth-teacher.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isAuthenticated: boolean = false;

  constructor(
    private authTeacherService: AuthTeacherService,
    private router: Router) {
    // subscripción a los cambios en el estado de autenticación
    this.authTeacherService.isAuthenticated.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  logout() {
    this.authTeacherService.removeToken();
    this.router.navigate(['/landing-page']);
  }
}
