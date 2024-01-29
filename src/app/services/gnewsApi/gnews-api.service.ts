import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Article, NewsAPIResponse } from '../../interfaces/gnewsApi.interface.';

@Injectable({
  providedIn: 'root'
})
export class GNewsApiService {
  private http = inject(HttpClient);
  private _newsApiUrl: string = 'https://gnews.io/api/v4/search?';
  private _apiGNewsApi: string = environment.apiKeyGNewsApi;

  private _educationNews = new BehaviorSubject<Article[]>([]);

  get educationNews() {
    return this._educationNews.asObservable();
  }

  public getEducationNews() {
    let params = new HttpParams()
    .set ('q', 'ensenanza')
    .set('lang', 'es')
    .set('max', '5')
    .set('apikey', this._apiGNewsApi);

    return this.http.get<NewsAPIResponse>(this._newsApiUrl, {params}).subscribe({
      next: (response) => {
        if (response) {
          this._educationNews.next(response.articles);
        } else {
          console.error('Error al obtener la noticias', response);
        }
      },
      error: (error) => {
        console.error('Error al conectar con la api', error);
      }
    })
  }
}
