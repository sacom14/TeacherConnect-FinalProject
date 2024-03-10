import { PaymentMethod } from './../../../interfaces/payment-method.interface';
import { Component } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, window } from 'rxjs';
import { Subject } from '../../../interfaces/subject.interface';
import { AcademicYear } from '../../../interfaces/academic-year.interface';
import { ValidationService } from '../../../services/validations/validations-service.service';
import { StudentService } from '../../../services/student/student-service.service';
import { SubjectService } from '../../../services/subject/subject.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StudentById } from '../../../interfaces/student.interface';
import { ImagebbService } from '../../../services/imageBB/imagebb.service';

@Component({
  selector: 'app-update-student-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './update-student-form-page.component.html',
  styleUrl: './update-student-form-page.component.scss'
})
export class UpdateStudentFormPageComponent {
  public paymentMethods!: Observable<PaymentMethod[]>;
  public subjects!: Observable<Subject[]>;
  public academicYears!: Observable<AcademicYear[]>;

  public emailExist: boolean = false;

  public selectedStudentId!: number | null;
  public initialStudentSubjects: number[] = [];
  public dataOfStudentSelected!: Observable<StudentById[] | null>;
  public currentStudentEmail!: string | null;

  private imageUrl!: Observable<string>;


  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private imageBbService:ImagebbService,
    private router: Router) {

    this.paymentMethods = this.studentService.paymentMethods;
    this.subjects = this.subjectService.subjects;
    this.academicYears = this.studentService.academicYears;
  }

  public updateStudentForm: FormGroup = this.fb.group({
    studentName: ['', [Validators.required, Validators.pattern(this.validationService.namePattern)]],
    studentSurname: ['', [Validators.required, Validators.pattern(this.validationService.surnamePattern)]],
    studentEmail: ['', [Validators.required, Validators.pattern(this.validationService.emailPattern)]],
    studentBirthdate: ['', [Validators.required, Validators.pattern(this.validationService.birthdatePattern)]],
    studentPhone: ['', [Validators.required, Validators.pattern(this.validationService.phonePattern)]],
    studentPhotoFile: [''], //we dont push this on our DB
    studentPhoto: [''], //we push the url only don DB
    fkIdAcademicYear: ['', [Validators.required]],
    fkIdPaymentMethod: ['', [Validators.required]],
    selectedSubjects: new FormArray([]),

  });

  ngOnInit(): void {
    this.studentService.currentStudentIdSelected
      .subscribe(studentId => {
        this.selectedStudentId = studentId;
        this.dataOfStudentSelected = this.studentService.currentInfoStudentSelected;

        this.studentService.getPaymentMethod();
        this.studentService.getAcademicYear();
        this.subjectService.getSubject();
        this.setInputInitialValues();
      });
  }
  public onSubmit(): void {
    this.updateStudentForm.markAllAsTouched();
    if (this.updateStudentForm.valid) {

      this.checkEmail(); //check if some student from teacher has the same email.
    }
  };

  public setInputInitialValues() {
    this.dataOfStudentSelected.subscribe(data => {
      if (data && data.length > 0) {
        const studentData = data[0];

        const formatBirthdate = this.formatDate(studentData.student_birthdate);

        this.updateStudentForm.patchValue({
          studentName: studentData.student_name || '',
          studentSurname: studentData.student_surname || '',
          studentEmail: studentData.student_email || '',
          studentBirthdate: formatBirthdate || '',
          studentPhone: studentData.student_phone || '',
          studentPhoto: studentData.student_photo || '',
          fkIdAcademicYear: studentData.fk_id_academic_year || '',
          fkIdPaymentMethod: studentData.fk_id_payment_method || ''
        });
        this.currentStudentEmail = studentData.student_email;

        this.studentService.getTheStudentSubjects(studentData.id_student).subscribe(data => {
          this.initialStudentSubjects = data.subjects.map(subject => subject.fk_id_subject);
          this.setSetSubjectCheckboxes();
        });
      }
    });
  }

  public setSetSubjectCheckboxes() {
    this.subjects.subscribe(subjectList => {
      subjectList.forEach(subject => {
        if (this.initialStudentSubjects.includes(subject.id_subject)) {
          const checkArray: FormArray = this.updateStudentForm.get('selectedSubjects') as FormArray;
        }
      });
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


  public isValidField(field: string): boolean | null {
    return this.validationService.isValidField(this.updateStudentForm, field);
  };

  public onCheckboxChange(e: any, subjectId: number) {
    const checkArray: FormArray = this.updateStudentForm.get('selectedSubjects') as FormArray;
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
      this.updateStudentForm.patchValue({ studentPhotoFile: file });
    }
  }

  public checkEmail() {
    const inputEmail: string = this.updateStudentForm.get('studentEmail')?.value;
    if (inputEmail != this.currentStudentEmail) { //falta poner la condición de si es diferente el email es diferente al del estudiante
      this.studentService.checkRepeatEmail(inputEmail).subscribe({
        next: (response) => {
          if (response.message === "Email unique") {
            this.emailExist = false;
            this.getTheImageUrl();
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
    } else { //si el correo es igual
      this.getTheImageUrl();
    }
  }

  public getTheImageUrl(){
    const imageControl = this.updateStudentForm.get('studentPhotoFile');
    const imageFile: File | null = imageControl?.value;

  // Verificar si imageFile no es nulo y si es un archivo válido
  if (!imageFile || !(imageFile instanceof File)) {
    // Si no se ha seleccionado ningún archivo, llama a updateStudent directamente
    this.updateStudent();
    return;
  }
      this.imageBbService.getImageUrlFromFile(imageFile);

      this.imageBbService.imageUrlResponse.subscribe((imageUrl) => {
        if(imageUrl){
          this.updateStudentForm.patchValue({studentPhoto: imageUrl});
          this.updateStudent(); //add the new student
        }
      });

    this.updateStudentForm.value.studentPhoto = this.imageUrl;
  }

  public updateStudent() {
    const { selectedSubjects, studentPhotoFile, ...studentFormData } = this.updateStudentForm.value; //dont push subjects cause they go in another table.
    this.studentService.updateStudent(studentFormData, this.selectedStudentId)
      .subscribe({
        next: (response) => {
          if (response && this.selectedStudentId) {
            this.addNewStudentSubject(this.selectedStudentId);
            this.studentService.getSubjectsFromStudent(this.selectedStudentId);
            alert('El alumno se ha actualizado correctamente');
            //todo:hacer que salga un modal (o alert) verde como mensaje de todo correcto!
            this.router.navigate(['/student-page']);
          } else {
            alert('No se ha obtenido correctamente el Id de estudiante');
          }
        },
        error: (error) => {
          console.error('Error al añadir el nuevo alumno', error)
        },
      });
  }

  addNewStudentSubject(studentId: number) {
    // Obtener las asignaturas actuales del estudiante
    this.studentService.getTheStudentSubjects(studentId).subscribe({
      next: (response) => {
        const currentSubjects = response.subjects.map(s => s.fk_id_subject);
        const newSubjects: number[] = this.updateStudentForm.value.selectedSubjects;

        // Filtrar las nuevas asignaturas que no están en la lista actual
        const subjectsToAdd = newSubjects.filter(subject => !currentSubjects.includes(subject));

        // Enviar solo las nuevas asignaturas
        subjectsToAdd.forEach(subjectId => {
          this.studentService.createNewStudentSubject(studentId, subjectId).subscribe({
            next: () => {
              // Manejo de la respuesta exitosa
            },
            error: (error) => {
              console.error('Error al añadir la asignatura', error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Error al obtener las asignaturas del estudiante', error);
      }
    });
  }

}
