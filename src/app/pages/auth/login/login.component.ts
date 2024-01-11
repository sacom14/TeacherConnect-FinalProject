import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ValidationService } from '../../../services/validations/validations-service.service';
import { TeacherService } from '../../../services/teacher/teacher-service.service';
import { AuthTeacherService } from '../../../services/teacher/auth-teacher.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public correctEmailAndPassword:boolean = true;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private teacherService: TeacherService,
    private authTeacherService: AuthTeacherService,
    private router: Router
    ) {
      this.correctEmailAndPassword = true;
    }

  public myFormLogin: FormGroup = this.fb.group({
    teacherEmail: ['', [Validators.required]],
    teacherPassword: ['', [Validators.required]],
  });

  public onSubmit(): void {
    this.myFormLogin.markAllAsTouched();
    if (this.myFormLogin.valid) {
      const email = this.myFormLogin.get('teacherEmail')?.value;
      const password = this.myFormLogin.get('teacherPassword')?.value;

      this.teacherService.login(email, password).subscribe({
        next: (response) => {
          this.authTeacherService.login(response.token, response.teacherId)//save token on localstorage?
          this.router.navigate(['/home-page']);
        },
        error: (error) => {
          console.error('Error during login: ', error);
          if (error.status === 401 || error.status === 404) {
            // Cambiar el booleano para mostrar el mensaje de error
            this.correctEmailAndPassword = false;
          }
        }
      });
    }
  };
  public isValidField(field: string) {
    return this.validationService.isValidField(this.myFormLogin, field);
  };



}
