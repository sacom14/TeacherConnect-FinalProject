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
import { NewStudentFormPageComponent } from './pages/student-page/new-student-form-page/new-student-form-page.component';
import { UpdateStudentFormPageComponent } from './pages/student-page/update-student-form-page/update-student-form-page.component';
import { SessionPageComponent } from './pages/session-page/session-page.component';
import { NewSessionFormComponent } from './pages/session-page/new-session-form/new-session-form.component';
import { UpdateSessionFormComponent } from './pages/session-page/update-session-form/update-session-form.component';
import { TeacherPageComponent } from './pages/teacher-page/teacher-page.component';
import { UpdateTeacherFormComponent } from './pages/teacher-page/update-teacher-form/update-teacher-form.component';

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

  {path: 'teacher-page', component: TeacherPageComponent, canActivate: [authGuard]},
  {path: 'update-teacher', component: UpdateTeacherFormComponent, canActivate: [authGuard]},
  
  {path: 'add-student', component: NewStudentFormPageComponent, canActivate: [authGuard]},
  {path: 'update-student', component: UpdateStudentFormPageComponent, canActivate: [authGuard]},

  {path: 'session-page/:selectedStudentId', component: SessionPageComponent, canActivate: [authGuard]}, //todo: se puede quitar??
  {path: 'add-session/:selectedStudentId', component: NewSessionFormComponent, canActivate: [authGuard]},
  {path: 'edit-session/:selectedSessionId/:selectedStudentId', component: UpdateSessionFormComponent, canActivate: [authGuard]},

  {path: '**', pathMatch:'full', redirectTo: 'landing-page'}
];
