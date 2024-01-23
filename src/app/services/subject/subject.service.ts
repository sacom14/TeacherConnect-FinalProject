import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, SubjectResponse } from '../../interfaces/subject.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private http = inject(HttpClient);

  private _subjectApiUrl: string = 'http://localhost:3000/api/subject';

  private _subjectList = new BehaviorSubject<Subject[]>([]);

  public getSubject(){
    this.http.get<SubjectResponse>(this._subjectApiUrl).subscribe({
      next: (response) => {
        this._subjectList.next(response.subjects);
      },
      error: (error) => {
        console.error('Error al recuperar las asignaturas', error);
      }
    });
  }

  get subjects(){
    return this._subjectList.asObservable();
  }
}