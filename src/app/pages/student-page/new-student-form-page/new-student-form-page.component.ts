import { PaymentMethod } from './../../../interfaces/payment-method.interface';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { StudentService } from '../../../services/student/student-service.service';
import { Observable } from 'rxjs';
import { Subject } from '../../../interfaces/subject.interface';
import { SubjectService } from '../../../services/subject/subject.service';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { AcademicYear } from '../../../interfaces/academic-year.interface';

@Component({
  selector: 'app-new-student-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './new-student-form-page.component.html',
  styleUrl: './new-student-form-page.component.scss'
})
export class NewStudentFormPageComponent implements OnInit {
  public paymentMethods!: Observable<PaymentMethod[]>;
  public subjects!: Observable<Subject[]>;
  public academicYears!: Observable<AcademicYear[]>;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private studentService: StudentService,
    private subjectService: SubjectService) {

    this.paymentMethods = this.studentService.paymentMethods;
    this.subjects = this.subjectService.subjects;
    this.academicYears = this.studentService.academicYears;
  }

  public addStudentForm: FormGroup = this.fb.group({
    studentName: ['', [Validators.required, Validators.pattern(this.validationService.namePattern)]],
    studentSurname: ['', [Validators.required, Validators.pattern(this.validationService.surnamePattern)]],
    studentEmail: ['', [Validators.required, Validators.pattern(this.validationService.emailPattern)]],
    studentBirthdate: ['', [Validators.required, Validators.pattern(this.validationService.birthdatePattern)]],
    studentPhone: ['', [Validators.required, Validators.pattern(this.validationService.phonePattern)]],
    studentPhoto: ['', [this.validationService.imageExtensionValidator]],
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
      //todo: revisar si el mail esta repetido entre los estudiantes de un profesor.
      this.addNewStudent();
    }
  };

  public isValidField(field: string):boolean | null {
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
      this.addStudentForm.patchValue({ image: file });
      this.addStudentForm.get('image')?.updateValueAndValidity();
    }
  }

  addNewStudent() {

  }
}
