import { Student, StudentResponse } from './../../../interfaces/student.interface';
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

  public emailExist:boolean = false;
  router: any;

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
      this.checkEmail(); //check if some student from teacher has the same email.
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

  public checkEmail() {
    const email: string = this.addStudentForm.get('studentEmail')?.value;

    this.studentService.checkRepeatEmail(email).subscribe({
      next: (response) => {
        if (response.message === "Email unique") {
          this.emailExist = false;
          this.addNewStudent();
        } else {
          this.emailExist = true;
          return alert('Ya tienes un estudiante con ese email, prueba con otro');
        }
      },
      error: (errorResponse) => {
        if (errorResponse.status === 409) {
          this.emailExist = true;
          alert('Ya tienes un estudiante con ese email, prueba con otro');
        } else {
          console.error('Error checking email: ', errorResponse);
        }
      }
    });
  }


  addNewStudent() {
    const { selectedSubjects, ...studentFormData } = this.addStudentForm.value; //dont push subjects cause they go in another table.
    this.studentService.createNewStudent(studentFormData)
      .subscribe({
        next: (response) => {

          const studentId = response.id_student; //take the studentId added
          this.addNewStudentSubject(studentId);
          alert('El alumno se ha registrado correctamente');
          //hacer que salga un modal (o alert) verde como mensaje de todo correcto!

          this.router.navigate(['/student-page'])
        },
        error: (error) => {
          console.error('Error al añadir el nuevo alumno', error)
        },
      });
  }

  addNewStudentSubject(studentId: number){
    const {selectedSubjects} = this.addStudentForm.value;
    //use studentId and all subjects from formgroup
    this.studentService.createNewStudentSubject(studentId, selectedSubjects)
    .subscribe({
      next: (response) => {
        console.log('Todas las asignaturas han sido creadas', response);
        return;
      },
      error: error => {
        console.error('Error al crear las asignaturas', error);
      }
    });
  }
}
