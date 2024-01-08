import { Component } from '@angular/core';

import { FilterbarStudentComponent } from './filterbar-student/filterbar-student.component';
import { InfoStudentComponent } from './info-student/info-student.component';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [FilterbarStudentComponent, InfoStudentComponent],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.scss'
})
export class StudentPageComponent {

}
