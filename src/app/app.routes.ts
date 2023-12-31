import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';

export const routes: Routes = [
  {path: 'landing-page', component: MainPageComponent},
  {path: 'home-page', component: HomePageComponent},
  {path: 'student-page', component: StudentPageComponent},
  {path: 'calendar-page', component: MapPageComponent},
  {path: 'map-page', component: MapPageComponent},

  {path: '**', pathMatch:'full', redirectTo: 'landing-page'}
];
