
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AllDataStudentSubjectsResponse, Student, StudentAddedResponse, StudentEmailCheckResponseMessage, StudentResponse, StudentByIdResponse, StudentById } from '../../interfaces/student.interface';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { AuthTeacherService } from '../teacher/auth-teacher.service';
import { PaymentMethod, PaymentMethodResponse } from '../../interfaces/payment-method.interface';
import { AcademicYear, AcademicYearResponse } from '../../interfaces/academic-year.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private authTeacherService = inject(AuthTeacherService);

  private _studentApiUrl: string = 'http://localhost:3000/api/student';
  private _paymentMethodApiUrl: string = 'http://localhost:3000/api/payment-method';
  private _academicYearApiUrl: string = 'http://localhost:3000/api/academic-year';
  private _studentSubjectApiUrl: string = 'http://localhost:3000/api/studentSubject';

  private _studentsList = new BehaviorSubject<Student[]>([]);
  private _paymentMethodList = new BehaviorSubject<PaymentMethod[]>([]);
  private _academicYearList = new BehaviorSubject<AcademicYear[]>([]);
  private _currentStudendIdSelected = new BehaviorSubject<number | null>(null);
  private _dataOfStudentSelected = new BehaviorSubject<StudentById[] | null>(null);

  public getStudentsFromTeacher() {
    const teacherId = this.authTeacherService.getTeacherId();
    if (teacherId) {
      this.http.get<StudentResponse>(`${this._studentApiUrl}/teacher/${teacherId}`).subscribe({
        next: (response) => {
          this._studentsList.next(response.students);
        },
        error: (error) => {
          console.error('Error al obtener los estudiantes', error);
        }
      });
    } else {
      console.error('ID del profesor no disponible');
    }
  }

  public getPaymentMethod() {
    this.http.get<PaymentMethodResponse>(this._paymentMethodApiUrl).subscribe({
      next: (response) => {
        this._paymentMethodList.next(response.paymentMethods);
      },
      error: (error) => {
        console.error('Error al obtener los métodos de pago', error);
      }
    });
  }

  public getAcademicYear() {
    this.http.get<AcademicYearResponse>(this._academicYearApiUrl).subscribe({
      next: (response) => {
        this._academicYearList.next(response.academicYears);
      },
      error: (error) => {
        console.error('Error al obtener los cursos académicos', error);
      }
    });
  }

  get students() {
    return this._studentsList.asObservable();
  }

  get paymentMethods() {
    return this._paymentMethodList.asObservable();
  }

  get academicYears() {
    return this._academicYearList.asObservable();
  }

  get currentStudentIdSelected(){
    return this._currentStudendIdSelected.asObservable();
  }

  get currentInfoStudentSelected(){
    return this._dataOfStudentSelected.asObservable();
  }

  //--------------student-page.compoent---------------
  //chek if the email is already on BD by teacher ID
  public checkRepeatEmail(studentEmail: string) {
    const teacherId = this.authTeacherService.getTeacherId();

    this.getStudentsFromTeacher();
    return this.http.post<StudentEmailCheckResponseMessage>(`${this._studentApiUrl}/check-email/${teacherId}`, { studentEmail });
  }

  //get all subjects from studentId
  public getTheStudentSubjects(studentId: number) {
    return this.http.get<AllDataStudentSubjectsResponse>(`${this._studentSubjectApiUrl}/student/${studentId}`)
      .pipe(
        catchError((error) => {
          console.error('Error en el servicio', error);
          return throwError(() => new Error('Error al obtener las asignaturas del estudiante con id' + studentId));
        })
      );
  }

  //--------------new-student-form.compoent---------------
  //create student
  public createNewStudent(studentData: Student) {
    const teacherId = this.authTeacherService.getTeacherId();
    if (teacherId) {
      return this.http.post<StudentAddedResponse>(`${this._studentApiUrl}/${teacherId}`, studentData)
        .pipe(
          catchError((error) => {
            console.error('Error en el servicio:', error);
            return throwError(() => new Error('Error al crear el alumno'));
          })
        );
    } else {
      return throwError(() => new Error('Id del profesor no disponible'));
    }
  }
  //create studentSubject
  public createNewStudentSubject(studentId: number, subjectId: number) {
    //todo: comprobaciones para que no se repita el id de subject y no se duplique información?
    return this.http.post(this._studentSubjectApiUrl, { studentId, subjectId })
      .pipe(
        catchError((error) => {
          console.error('Error en el servicio', error);
          return throwError(() => new Error('Error al añadir una asignatura al estudiante'));
        })
      );
  }

  //-------------info-student.component-----------------
  public changeCurrentStudentIdSelected(currentStudentSelected: number | null){
    this._currentStudendIdSelected.next(currentStudentSelected);
    this.getStudentById(currentStudentSelected);
  }

  public getStudentById(studentIdSelected: number | null){
    if (studentIdSelected) {
      this.http.get<StudentByIdResponse>(`${this._studentApiUrl}/${studentIdSelected}`).subscribe({
        next: (response) => {
          this._dataOfStudentSelected.next(response.studentById);
        },
        error: (error) => {
          console.error('Error al obtener la información del estudiante', error);
        }
      });
    } else {
      console.error('ID del estudiante no disponible');
    }
  }

  public getAgeFromBirthdate(birthdate: string): number{
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
  }
  //-------------update-student.component---------------------
  updateStudent(studentData: Student, selectedStudentId: number | null){
    const teacherId = this.authTeacherService.getTeacherId();
    if (teacherId) {
      //add the teacherId value on fkIdTeacher for body query for back.
      const studentDataWithTeacherId = {...studentData, fkIdTeacher: teacherId};

      return this.http.put(`${this._studentApiUrl}/${selectedStudentId}`, studentDataWithTeacherId)
        .pipe(
          catchError((error) => {
            console.error('Error en el servicio:', error);
            return throwError(() => new Error('Error al actualizar el alumno'));
          })
        );
    } else {
      return throwError(() => new Error('Id del profesor no disponible'));
    }
  }
}
