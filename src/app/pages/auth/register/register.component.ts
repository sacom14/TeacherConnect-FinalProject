import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ValidationService } from '../../../services/validations/validations-service.service';
import { TeacherService } from '../../../services/teacher/teacher-service.service';
import { ImagebbService } from '../../../services/imageBB/imagebb.service';
import { Observable } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, ToastrModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private teacherService = inject(TeacherService);
  private imageBbService = inject(ImagebbService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  private imageUrl!: Observable<string>;
  public emailExist:boolean = false;


  public myFormRegister: FormGroup = this.fb.group({
    teacherName: ['', [Validators.required, Validators.pattern(this.validationService.namePattern)]],
    teacherSurname: ['', [Validators.required, Validators.pattern(this.validationService.surnamePattern)]],
    teacherEmail: ['', [Validators.required, Validators.pattern(this.validationService.emailPattern)]],
    teacherPhone: ['', [Validators.required, Validators.pattern(this.validationService.phonePattern)]],
    teacherBirthdate: ['', [Validators.required, Validators.pattern(this.validationService.birthdatePattern)]],
    teacherPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.validationService.passwordPattern)]],
    password2: ['', [Validators.required]],
    teacherPhotoFile: ['', [this.validationService.imageExtensionValidator]],
    teacherPhoto: [''],
  },
    {
      //las funciones de este argumento, pasan como argumento implícito todo el formulario (tenemos acceso a todo el formualio, a todos los campos)
      validators: [
        this.validationService.isPasswordOneEqualPasswordTwo('teacherPassword', 'password2'),
      ]
    });

  public onSubmit(): void {
    this.myFormRegister.markAllAsTouched();
    if (this.myFormRegister.valid) {
      this.checkEmail();
    }
  };

  public isValidField(field: string) {
    return this.validationService.isValidField(this.myFormRegister, field);
  };

  //para asegurarnos de que el formato del archivo sea correcto
  public onImageChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.item(0);
    if (file) {
      this.myFormRegister.patchValue({ teacherPhotoFile: file });
    }
  }

  public checkEmail() {
    const email: string = this.myFormRegister.get('teacherEmail')?.value;
    this.teacherService.checkRepeatEmail(email).subscribe({
      next: (response) => {
        if (response.message === "Valid email" || response.message === "This email belongs to the current teacher") {
          this.emailExist = false;
          this.getTheImageUrl();
        } else {
          this.emailExist = true;
          this.showErrorRepeatEmail();
        }
      },
      error: (errorResponse) => {
        if (errorResponse.status === 500) {
          this.emailExist = true;
          this.showErrorRepeatEmail();
        } else {
          this.showError();
          console.error('Error checking email: ', errorResponse);
        }
      }
    })
  }

  public getTheImageUrl(){
    const imageControl = this.myFormRegister.get('teacherPhotoFile');
    const imageFile: File | null = imageControl?.value;

    this.imageBbService.getImageUrlFromFile(imageFile);

    this.imageBbService.imageUrlResponse.subscribe((imageUrl) => {
      if(imageUrl){
        this.myFormRegister.patchValue({teacherPhoto: imageUrl});
        this.newRegisterUser();
      } else {
        this.myFormRegister.patchValue({teacherPhoto: 'https://i.ibb.co/tCVgL7j/default-teacher-img.jpg'});
        this.newRegisterUser();
      }
    })
    this.myFormRegister.value.teacherPhoto = this.imageUrl;
  }

  public newRegisterUser() {
    const { password2, teacherPhotoFile, ...formData } = this.myFormRegister.value; //excluimos el 'password2' porque no lo queremos en la bd
    this.teacherService.createNewTeacher(formData)
      .subscribe({
        next: (response) => {
          this.showSuccess();
          this.router.navigate(['/login-page'])
        },
        error: (error) => {
          this.showError();
          console.error('Error al registrarse', error)
        },
      });
  }

  private showSuccess() {
    this.toastrService.success('Se ha creado la cuenta correctamente!', 'Felicidades!');
  }

  private showError() {
    this.toastrService.error('Ha habido un error en la creación de su cuenta', 'Ups!');
  }
  private showErrorRepeatEmail(){
    this.toastrService.error('Ya existe una cuenta con ese email, prueba con otro', 'Ups');
  }
}
