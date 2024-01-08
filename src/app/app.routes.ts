import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { authGuard } from './pages/auth/auth.guard';
import { noAuthGuard } from './pages/auth/no-auth.guard';

export const routes: Routes = [
  //without aunthenticated
  {path: 'landing-page', component: MainPageComponent, canActivate: [noAuthGuard]},
  {path: 'login-page', component: LoginComponent, canActivate: [noAuthGuard]},
  {path: 'register-page', component: RegisterComponent, canActivate: [noAuthGuard]},

  //need authenticated
  {path: 'home-page', component: HomePageComponent, canActivate: [authGuard]},
  {path: 'student-page', component: StudentPageComponent, canActivate: [authGuard]},
  {path: 'calendar-page', component: CalendarPageComponent, canActivate: [authGuard]},
  {path: 'map-page', component: MapPageComponent, canActivate: [authGuard]},
  
  {path: '**', pathMatch:'full', redirectTo: 'landing-page'}
];
