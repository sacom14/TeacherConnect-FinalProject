import { Component } from '@angular/core';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/header/navbar/navbar.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ RouterOutlet, LandingPageComponent, NavbarComponent ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
