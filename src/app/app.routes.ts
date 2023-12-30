import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  {path: 'landing-page', component: MainPageComponent},
  {path: 'home-page', component: HomePageComponent},

  {path: '**', pathMatch:'full', redirectTo: 'landing-page'}
];
