import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ImageBbResponse } from '../../interfaces/imagebb-interface';


@Injectable({
  providedIn: 'root'
})
export class ImagebbService {
  private http = inject(HttpClient);
  private _imageBBApiUrl: string = 'https://api.imgbb.com/1/upload';
  private _apiKeyImageBB: string = environment.apiKeyImageBB;

  private _imageUrlResponse = new BehaviorSubject<string>('');

  get imageUrlResponse() {
    return this._imageUrlResponse.asObservable();
  }

  public getImageUrlFromFile(image: File | null) {
    if (image){
      const formData = new FormData();
      formData.append('image', image);

      this.http.post<ImageBbResponse>(this._imageBBApiUrl, formData,{ params: { key: this._apiKeyImageBB } }).subscribe({
        next: (response) => {
          if (response.data && response.data.url) {
            this._imageUrlResponse.next(response.data.url);
          } else {
            console.error('Error al obtener la URL de la imagen desde ImageBB', response);
          }
        },
        error: (error) => {
          console.error('Error al subir la imagen a imageBB', error);
        }
      })
    } else {
      console.error('Error al subir la imagen a imageBB');
      return;
    }

  }

}
