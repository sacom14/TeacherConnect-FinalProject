import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TeacherValidationServiceService } from '../../../services/teacher/teacher-validation-service.service';
import { TeacherServiceService } from '../../../services/teacher/teacher-service.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(
    private fb: FormBuilder,
    private teacherValidators:TeacherValidationServiceService,
    private teacherService:TeacherServiceService,
    private router:Router) {}

  public myFormRegister: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.teacherValidators.namePattern)]],
    surname: ['', [Validators.required, Validators.pattern(this.teacherValidators.surnamePattern)]],
    email: ['', [Validators.required, Validators.pattern(this.teacherValidators.emailPattern)]], //porque no es una función, sinó expression regular
    phone: ['', [Validators.required, Validators.pattern(this.teacherValidators.phonePattern)]],
    birthdate: ['', [Validators.required, Validators.pattern(this.teacherValidators.birthdatePattern)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.teacherValidators.passwordPattern)]],
    password2: ['', [Validators.required]],
    photo: ['', [this.teacherValidators.imageExtensionValidator]],
  },
  {
    //las funciones de este argumento, pasan como argumento implícito todo el formulario (tenemos acceso a todo el formualio, a todos los campos)
    validators: [
      this.teacherValidators.isPasswordOneEqualPasswordTwo('password', 'password2'),
    ]
  });

  public onSubmit():void {
    this.myFormRegister.markAllAsTouched();
    console.log(this.myFormRegister)
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

  public newRegisterUser(){}

}
