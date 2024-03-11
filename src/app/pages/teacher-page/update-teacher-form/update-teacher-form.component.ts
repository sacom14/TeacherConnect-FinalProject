import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImagebbService } from '../../../services/imageBB/imagebb.service';
import { TeacherService } from '../../../services/teacher/teacher-service.service';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { Teacher, TeacherResponse } from '../../../interfaces/teacher.interface';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-teacher-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, ToastrModule],
  templateUrl: './update-teacher-form.component.html',
  styleUrl: './update-teacher-form.component.scss'
})
export class UpdateTeacherFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private teacherService = inject(TeacherService);
  private imageBbService = inject(ImagebbService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  private imageUrl!: Observable<string>;
  public currentTeacherEmail!: string | null;
  public currentTeacherImageUrl!:string | null;
  public emailExist: boolean = false;
  public teacherData!: Observable<Teacher[]>;

  constructor() {
    this.teacherData = this.teacherService.teacherData;
  }

  public updateTeacherForm: FormGroup = this.fb.group({
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
      validators: [
        this.validationService.isPasswordOneEqualPasswordTwo('teacherPassword', 'password2'),
      ]
    });


  ngOnInit(): void {
    this.teacherService.getTeacherDataById();
    this.setInputInitialValues();
  }

  public setInputInitialValues() {
    this.teacherData.subscribe(data => {
      if (data && data.length > 0) {
        let teacherData = data[0];

        let formatBirthdate = this.formatDate(teacherData.teacher_birthdate);

        this.updateTeacherForm.patchValue({
          teacherName: teacherData.teacher_name || '',
          teacherSurname: teacherData.teacher_surname || '',
          teacherEmail: teacherData.teacher_email || '',
          teacherBirthdate: formatBirthdate || '',
          teacherPassword: teacherData.teacher_password || '',
          password2: teacherData.teacher_password || '',
          teacherPhone: teacherData.teacher_phone || '',
          teacherPhoto: teacherData.teacher_photo || '',
        });
        this.currentTeacherEmail = teacherData.teacher_email;

        this.currentTeacherImageUrl = teacherData.teacher_photo;
      }
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  public onSubmit(): void {
    this.updateTeacherForm.markAllAsTouched();
    if (this.updateTeacherForm.valid) {
      this.checkEmail();
    }
  };

  public isValidField(field: string) {
    return this.validationService.isValidField(this.updateTeacherForm, field);
  };

  //para asegurarnos de que el formato del archivo sea correcto
  public onImageChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.item(0);
    if (file) {
      this.updateTeacherForm.patchValue({ teacherPhotoFile: file });
    }
  }

  public checkEmail() {
    const email: string = this.updateTeacherForm.get('teacherEmail')?.value;
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

  public getTheImageUrl() {
    const imageControl = this.updateTeacherForm.get('teacherPhotoFile');
    const imageFile: File | null = imageControl?.value;

    this.imageBbService.getImageUrlFromFile(imageFile);

    this.imageBbService.imageUrlResponse.subscribe((imageUrl) => {
      if (imageUrl) {
        this.updateTeacherForm.patchValue({ teacherPhoto: imageUrl });
        this.updateTeacherData();
      } else {
        this.updateTeacherForm.patchValue({teacherPhoto: this.currentTeacherImageUrl });
        this.updateTeacherData();
      }
    })
    this.updateTeacherForm.value.teacherPhoto = this.imageUrl;
  }

  public updateTeacherData() {
    const { password2, teacherPhotoFile, ...formData } = this.updateTeacherForm.value;
    this.teacherService.updateTeacher(formData)
      .subscribe({
        next: (response) => {
          this.showSuccess();
          this.router.navigate(['/teacher-page'])
        },
        error: (error) => {
          this.showError()
          console.error('Error al actualizar los datos del profesor', error)
        },
      });
  }

  private showSuccess() {
    this.toastrService.success('Se han actualizado los datos correctamente!', 'Felicidades!');
  }

  private showError() {
    this.toastrService.error('Ha habido un error en la actualización de su cuenta', 'Ups!');
  }
  private showErrorRepeatEmail(){
    this.toastrService.error('Ya existe una cuenta con ese email, prueba con otro', 'Ups');
  }

}
