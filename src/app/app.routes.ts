import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';

export const routes: Routes = [
  {path: 'landing-page', component: MainPageComponent},
  {path: 'home-page', component: HomePageComponent},
  {path: 'student-page', component: StudentPageComponent},
  {path: 'calendar-page', component: CalendarPageComponent},
  {path: 'map-page', component: MapPageComponent},
  {path: 'login-page', component: LoginComponent},
  {path: 'register-page', component: RegisterComponent},


  {path: '**', pathMatch:'full', redirectTo: 'landing-page'}
];
