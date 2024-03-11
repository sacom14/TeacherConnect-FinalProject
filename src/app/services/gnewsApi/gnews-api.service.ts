import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { } from '../../../environments/environment';
import { Article, NewsAPIResponse } from '../../interfaces/gnewsApi.interface.';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GNewsApiService {
  private http = inject(HttpClient);
  private _newsApiUrl: string = 'https://gnews.io/api/v4/search?';
  private _apiGNewsApi: string = environment.API_KEY_GNEWSAPI;

  private _educationNews = new BehaviorSubject<Article[]>([]);

  get educationNews() {
    return this._educationNews.asObservable();
  }
  private mockNews: Article[] = [
    {
      content: "Aunque hay tantas deficiencias en los colegios, hoy inicia el Año Escolar 2024 de manera oficial y vuelven millones de niños y adolescentes en costa, sierra y selva a las aulas llenos de ilusiones. Lo que se quiere es que nuestros alumnos estudien y ... [718 chars]",
      description: "Nuestros estudiantes deben recibir educación de calidad y con valores, porque solo así tendremos una generación que pueda hacer frente a tantos problemas sociales.",
      image: "https://ojo.pe/resizer/HQjWpzUMrMR-capM-D4c9qthgtc=/980x528/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/JDD654ZZUFALBIOLEOZE34Q2KA.jpg",
      publishedAt: new Date("2024-03-11T11:30:00Z"),
      source: { name: 'Diario Ojo', url: 'https://ojo.pe' },
      title: "La cruda realidad: Que sea un buen año escolar",
      url: "https://ojo.pe/columnistas/la-cruda-realidad-que-sea-un-buen-ano-escolar-noticia/"
    },
    {
      content: "Alemania ofrece 27 puestos de trabajo para graduados en pedagogía en las regiones de Vulkaneifel y Mosela. Los puestos, ofertados por la Oficina Central de Intermediación Internacional Profesional de Alemania, se anuncian a través de la web de la red... [2494 chars]",
      description: "Se ofrecen 27 vacantes para graduados en pedagogía, psicología o educación en las regiones de Vulkaneifel y Mosela, para trabajar con jóvenes en dos centros res",
      image: "https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2024/03/08/alemania-ofrece-empleo-para-graduados-en-pedagogia-en-la-region-de-vulkaneifel.jpeg",
      publishedAt: new Date("2024-03-11T06:31:59Z"),
      source: { name: '20 Minutos', url: 'https://www.20minutos.es' },
      title: "Alemania busca educadores por sueldos de hasta 3.700 euros: estos son los requisitos y cómo solicitar",
      url: "https://www.20minutos.es/noticia/5225584/0/alemania-busca-educadores-sueldos-3700-euros-requisitos/"
    },
    {
      content: "Un grupo de operarios recoge la basura mientras el bullicio de un patio de colegio se eleva por encima de la verja junto a un centro de salud del que entran y salen sobre todo mujeres con niños. Nada de lo que ocurre en esa escena de la vida cotidian... [9064 chars]",
      description: "La sanidad, educación o recogida de basuras en los campos de desplazados dependen directamente de la UNRWA, en el punto de mira de Israel",
      image: "https://imagenes.elpais.com/resizer/qlenPPy6WXn5Llf8zNJwNt-doMo=/1200x0/filters:focal(2626x2617:2636x2627)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/CGFTGEUQ7JAZZCGZUQ2IC4MSUQ.JPG",
      publishedAt: new Date("2024-03-11T04:40:00Z"),
      source: { name: 'El País', url: 'https://elpais.com' },
      title: "La campaña de acoso y desprestigio pone en riesgo el trabajo de la agencia de la ONU para los palestinos",
      url: "https://elpais.com/internacional/2024-03-11/la-campana-de-acoso-y-desprestigio-pone-en-riesgo-el-trabajo-de-la-agencia-de-la-onu-para-los-palestinos.html"
    }
  ];


  public getEducationNews() {
    let params = new HttpParams()
      .set('q', 'educacion')
      .set('lang', 'es')
      .set('max', '3')
      .set('apikey', this._apiGNewsApi);

    return this.http.get<NewsAPIResponse>(this._newsApiUrl, { params }).subscribe({
      next: (response) => {
        if (response) {
          this._educationNews.next(response.articles);
        } else {
          this._educationNews.next(this.mockNews);
        }
      },
      error: (error) => {
        this._educationNews.next(this.mockNews);
      }
    })
  }
}
