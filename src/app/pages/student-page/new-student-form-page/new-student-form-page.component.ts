import { PaymentMethod } from './../../../interfaces/payment-method.interface';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { StudentService } from '../../../services/student/student-service.service';
import { Observable } from 'rxjs';
import { Subject } from '../../../interfaces/subject.interface';
import { SubjectService } from '../../../services/subject/subject.service';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { AcademicYear } from '../../../interfaces/academic-year.interface';
import { ImagebbService } from '../../../services/imageBB/imagebb.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-student-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, ToastrModule],
  templateUrl: './new-student-form-page.component.html',
  styleUrl: './new-student-form-page.component.scss'
})
export class NewStudentFormPageComponent implements OnInit {
  public paymentMethods!: Observable<PaymentMethod[]>;
  public subjects!: Observable<Subject[]>;
  public academicYears!: Observable<AcademicYear[]>;
  public emailExist: boolean = false;

  private imageUrl!: Observable<string>;

  private toastrService = inject(ToastrService);
  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private imageBbService: ImagebbService,
    private router:Router) {

    this.paymentMethods = this.studentService.paymentMethods;
    this.subjects = this.subjectService.subjects;
    this.academicYears = this.studentService.academicYears;
    this.imageUrl = this.imageBbService.imageUrlResponse;
  }

  public addStudentForm: FormGroup = this.fb.group({
    studentName: ['', [Validators.required, Validators.pattern(this.validationService.namePattern)]],
    studentSurname: ['', [Validators.required, Validators.pattern(this.validationService.surnamePattern)]],
    studentEmail: ['', [Validators.required, Validators.pattern(this.validationService.emailPattern)]],
    studentBirthdate: ['', [Validators.required, Validators.pattern(this.validationService.birthdatePattern)]],
    studentPhone: ['', [Validators.required, Validators.pattern(this.validationService.phonePattern)]],
    studentPhotoFile: [''], //we dont push this on our DB
    studentPhoto: [''], //we push the url only don DB
    fkIdAcademicYear: ['', [Validators.required]],
    fkIdPaymentMethod: ['', [Validators.required]],
    selectedSubjects: new FormArray([], this.validationService.checkMinOneSelectedValidator(1)),

  });

  ngOnInit(): void {
    this.studentService.getPaymentMethod();
    this.studentService.getAcademicYear();
    this.subjectService.getSubject();
  }

  public onSubmit(): void {
    this.addStudentForm.markAllAsTouched();
    if (this.addStudentForm.valid) {
      this.checkEmail(); //check if some student from teacher has the same email.
    }
  };

  public isValidField(field: string): boolean | null {
    return this.validationService.isValidField(this.addStudentForm, field);
  };

  public onCheckboxChange(e: any, subjectId: number) {
    const checkArray: FormArray = this.addStudentForm.get('selectedSubjects') as FormArray;
    // Check if the checkbox is checked
    if (e.target.checked) {
      checkArray.push(new FormControl(subjectId));
    } else {
      // Initialize index for tracking the control's position in FormArray
      let i: number = 0;
      // Iterate over each control in the FormArray
      checkArray.controls.forEach((control: AbstractControl) => {

        if (control.value == subjectId) {
          // If a match is found, remove the control at index i from FormArray
          checkArray.removeAt(i);
          // Exit the loop
          return;
        }
        // Increment index if no match is found
        i++;
      });
    }
  }

  //para asegurarnos de que el formato del archivo sea correcto
  public onImageChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.item(0);
    if (file) {
      this.addStudentForm.patchValue({ studentPhotoFile: file });
    }
  }

  public checkEmail() {
    const email: string = this.addStudentForm.get('studentEmail')?.value;

    this.studentService.checkRepeatEmail(email).subscribe({
      next: (response) => {
        if (response.message === "Email unique") {
          this.emailExist = false;
          this.getTheImageUrl();
        } else {
          this.emailExist = true;
          this.showErrorRepeatEmail();
        }
      },
      error: (errorResponse) => {
        if (errorResponse.status === 409) {
          this.emailExist = true;
          this.showErrorRepeatEmail();
        } else {
          console.error('Error checking email: ', errorResponse);
        }
      }
    });
  }

  public getTheImageUrl(){
    const imageControl = this.addStudentForm.get('studentPhotoFile');
    const imageFile: File | null = imageControl?.value;

    this.imageBbService.getImageUrlFromFile(imageFile);

    this.imageBbService.imageUrlResponse.subscribe((imageUrl) => {
      if(imageUrl){
        this.addStudentForm.patchValue({studentPhoto: imageUrl});
        this.addNewStudent();
      } else {
        this.addStudentForm.patchValue({studentPhoto: 'https://i.ibb.co/tCVgL7j/default-teacher-img.jpg'});
        this.addNewStudent();
      }
    })
    this.addStudentForm.value.studentPhoto = this.imageUrl;
  }

  public addNewStudent() {
    const { selectedSubjects, studentPhotoFile, ...studentFormData } = this.addStudentForm.value; //dont push subjects cause they go in another table.
    this.studentService.createNewStudent(studentFormData)
      .subscribe({
        next: (response) => {
          if (response.id_student) {
            const studentId = response.id_student;
            this.addNewStudentSubject(studentId);
            this.showSuccess();
            this.router.navigate(['/student-page'])
          }else {
            this.showError();
          }
        },
        error: (error) => {
          console.error('Error al añadir el nuevo alumno', error)
        },
      });
  }

  public addNewStudentSubject(studentId: number) {
    const subjects: number[] = this.addStudentForm.value.selectedSubjects;
    subjects.forEach(subjectId => {
      this.studentService.createNewStudentSubject(studentId, subjectId).subscribe({
        next: (response) => {
          return
        },
        error: (error) => {
          console.error('Error al añadir la asignatura', error);
        }
      });
    });
  }

  private showSuccess() {
    this.toastrService.success('Estudiante añadido correctamente!', 'Felicidades!');
  }

  private showError(){
    this.toastrService.error('Ha habido un error para añadir el estudiante', 'Ups!');
  }

  private showErrorRepeatEmail(){
    this.toastrService.error('Ya tienes un estudiante con ese email, prueba con otro', 'Ups');
  }


}
