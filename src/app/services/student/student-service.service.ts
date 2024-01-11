import { TeacherEmailCheckResponseMessage } from './../../interfaces/teacher.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, StudentResponse } from '../../interfaces/student.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthTeacherService } from '../teacher/auth-teacher.service';
import { PaymentMethod, PaymentMethodResponse } from '../../interfaces/payment-method.interface';
import { AcademicYear, AcademicYearResponse } from '../../interfaces/academic-year.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private _studentApiUrl: string = 'http://localhost:3000/api/student';
  private _paymentMethodApiUrl: string = 'http://localhost:3000/api/payment-method';
  private _academicYearApiUrl: string = 'http://localhost:3000/api/academic-year';

  private _studentsList = new BehaviorSubject<Student[]>([]);
  private _paymentMethodList = new BehaviorSubject<PaymentMethod[]>([]);
  private _academicYearList = new BehaviorSubject<AcademicYear[]>([]);

  constructor(
    private http: HttpClient,
    private authTeacherService: AuthTeacherService) { }

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

  public getPaymentMethod(){
    this.http.get<PaymentMethodResponse>(this._paymentMethodApiUrl).subscribe({
      next:(response) => {
        this._paymentMethodList.next(response.paymentMethods);
      },
      error: (error) => {
        console.error('Error al obtener los métodos de pago', error);
      }
    });
  }

  public getAcademicYear(){
    this.http.get<AcademicYearResponse>(this._academicYearApiUrl).subscribe({
      next:(response) => {
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

  get paymentMethods(){
    return this._paymentMethodList.asObservable();
  }
  
  get academicYears(){
    return this._academicYearList.asObservable();
  }

}
