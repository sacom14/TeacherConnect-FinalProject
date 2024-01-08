import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TeacherValidationServiceService } from '../../../services/teacher/teacher-validation-service.service';
import { TeacherService } from '../../../services/teacher/teacher-service.service';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public emailExist:boolean = false;

  constructor(
    private fb: FormBuilder,
    private teacherValidators: TeacherValidationServiceService,
    private teacherService: TeacherService,
    private router: Router) { }

  public myFormRegister: FormGroup = this.fb.group({
    teacherName: ['', [Validators.required, Validators.pattern(this.teacherValidators.namePattern)]],
    teacherSurname: ['', [Validators.required, Validators.pattern(this.teacherValidators.surnamePattern)]],
    teacherEmail: ['', [Validators.required, Validators.pattern(this.teacherValidators.emailPattern)]],
    teacherPhone: ['', [Validators.required, Validators.pattern(this.teacherValidators.phonePattern)]],
    teacherBirthdate: ['', [Validators.required, Validators.pattern(this.teacherValidators.birthdatePattern)]],
    teacherPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.teacherValidators.passwordPattern)]],
    password2: ['', [Validators.required]],
    teacherPhoto: ['', [this.teacherValidators.imageExtensionValidator]],
  },
    {
      //las funciones de este argumento, pasan como argumento implícito todo el formulario (tenemos acceso a todo el formualio, a todos los campos)
      validators: [
        this.teacherValidators.isPasswordOneEqualPasswordTwo('teacherPassword', 'password2'),
      ]
    });

  public onSubmit(): void {
    this.myFormRegister.markAllAsTouched();
    if (this.myFormRegister.valid) {
      this.checkEmail();
    }
  };

  public isValidField(field: string) {
    return this.teacherValidators.isValidField(this.myFormRegister, field);
  };

  //para asegurarnos de que el formato del archivo sea correcto
  public onImageChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.item(0);
    if (file) {
      this.myFormRegister.patchValue({ image: file });
      this.myFormRegister.get('image')?.updateValueAndValidity();
    }
  }

  public newRegisterUser() {
    const { password2, ...formData } = this.myFormRegister.value; //excluimos el 'password2' porque no lo queremos en la bd
    this.teacherService.createNewTeacher(formData)
      .subscribe({
        next: (response) => {
          alert('El registro se ha completado correctamente');
          //hacer que salga un modal (o alert) verde como mensaje de todo correcto!
          //redirigir al login
          this.router.navigate(['/login-page'])
        },
        error: (error) => {
          console.error('Error al registrarse', error)
        },
      });
  }

  public checkEmail() {
    const email: string = this.myFormRegister.get('teacherEmail')?.value;

    this.teacherService.checkRepeatEmail(email).subscribe({
      next: (response) => {
        if (response.message === "Email unique") {
          this.emailExist = false;
          this.newRegisterUser();
        } else {
          this.emailExist = true;
          return alert('El correo electrónico ya está registrado, ponga otro Email');
        }
      },
      error: (errorResponse) => {
        if (errorResponse.status === 409) {
          this.emailExist = true;
          alert('El correo electrónico ya está registrado, ponga otro Email');
        } else {
          console.error('Error checking email: ', errorResponse);
        }
      }
    });
  }
}
