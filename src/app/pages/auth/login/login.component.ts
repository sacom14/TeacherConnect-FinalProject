import { Component, inject } from '@angular/core';
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
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private teacherService = inject(TeacherService);
  private authTeacherService = inject(AuthTeacherService);
  private router = inject(Router);

  public correctEmailAndPassword:boolean = true;

  constructor() {
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
          console.log('1')
          this.router.navigate(['/home-page']);
        },
        error: (error) => {
          console.log('2')
          console.error('Error during login: ', error);
          if (error.status === 401 || error.status === 404) {
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
