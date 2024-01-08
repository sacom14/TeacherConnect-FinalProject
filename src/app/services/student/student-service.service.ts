import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, StudentResponse } from '../../interfaces/student.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthTeacherService } from '../teacher/auth-teacher.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private _studentApiUrl: string = 'http://localhost:3000/api/student';
  private _studentsList = new BehaviorSubject<Student[]>([]);

  constructor(
    private http: HttpClient,
    private authTeacherService: AuthTeacherService) { }

  getStudentsFromTeacher() {
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

  get students() {
    return this._studentsList.asObservable();
  }

}
