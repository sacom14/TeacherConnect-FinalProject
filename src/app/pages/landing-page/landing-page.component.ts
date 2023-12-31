import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ NgbCarouselModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  images = [
    '../../../assets/img/carousel/jerry-wang-KV9F7Ypl2N0-unsplash.webp',
    '../../../assets/img/carousel/sofatutor-4r5Hogjbgkw-unsplash.webp',
    '../../../assets/img/carousel/linkedin-sales-solutions-VtKoSy_XzNU-unsplash.webp',
  ];

  slogans = [
    'Enseña más, preocúpate menos. Gestión inteligente para profesores',
    'Abre las puertas a una educación revolucionaria: gestiona, organiza y prospera con la herramienta diseñada para el profesor del futuro',
    'Porque enseñar es un arte, y gestionar, nuestra ciencia',
  ]

	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = true;
	pauseOnFocus = true;

	@ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

	togglePaused() {
		if (this.paused) {
			this.carousel.cycle();
		} else {
			this.carousel.pause();
		}
		this.paused = !this.paused;
	}

	onSlide(slideEvent: NgbSlideEvent) {
		if (
			this.unpauseOnArrow &&
			slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
		) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}
}
