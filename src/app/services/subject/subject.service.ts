import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, SubjectResponse } from '../../interfaces/subject.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthTeacherService } from '../teacher/auth-teacher.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private http = inject(HttpClient);
  private authTeacherService = inject(AuthTeacherService);

  private _subjectApiUrl: string = 'https://teacherconnect-backend.onrender.com/api/subject';

  private _subjects = new BehaviorSubject<Subject[]>([]);

  get subjects(){
    return this._subjects.asObservable();
  }

  public getSubject(){
    const headers = this.authTeacherService.getHeadersWithAuthorization();
    this.http.get<SubjectResponse>(this._subjectApiUrl, {headers}).subscribe({
      next: (response) => {
        this._subjects.next(response.subjects);
      },
      error: (error) => {
        console.error('Error al recuperar las asignaturas', error);
      }
    });
  }


}
