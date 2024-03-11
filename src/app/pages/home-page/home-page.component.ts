import { Component, ViewChild, inject } from '@angular/core';
import { NgbCarousel, NgbCarouselModule, NgbModal, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Session, SessionFromTeacherId } from '../../interfaces/session.interface';
import { ModalStudentListComponent } from '../../modals/modal-student-list/modal-student-list.component';
import { SessionService } from '../../services/session/session.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';

import { StudentService } from '../../services/student/student-service.service';
import { Observable } from 'rxjs';
import { Student } from '../../interfaces/student.interface';
import { Article } from '../../interfaces/gnewsApi.interface.';
import { GNewsApiService } from '../../services/gnewsApi/gnews-api.service';
import { TeacherDetailsComponent } from '../teacher-page/teacher-details/teacher-details.component';
import { ModalSessionDetailsComponent } from '../../modals/modal-session-details/modal-session-details.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule, NgbCarouselModule, TeacherDetailsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  [x: string]: any;
  private sessionService = inject(SessionService);
  private modalService = inject(NgbModal);
  private studentService = inject(StudentService);
  private gnewsApiService = inject(GNewsApiService);



  public sessionListFromTeacherId!: SessionFromTeacherId[];
  public sessionsByDay: { [day: string]: SessionFromTeacherId[] } = {};
  public selectedStudentId!: number | null;
  public students!: Observable<Student[]>;
  public studentCount: number = 0;
  public payedSession!: Observable<Session[]>;
  public payedSessionCount: number = 0;
  public notPayedSession!: Observable<Session[]>;
  public notPayedSessionCount: number = 0;
  public educationNews!: Observable<Article[]>;

  constructor() {
    this.students = this.studentService.students;
    this.payedSession = this.sessionService.payedSessions;
    this.notPayedSession = this.sessionService.notPayedSessions;
    this.educationNews = this.gnewsApiService.educationNews;
  }

  ngOnInit(): void {
    this.sessionService.getAllSessionsFromTeacherId();
    this.studentService.getStudentsFromTeacher();
    this.sessionService.getAllPayedSessions();
    this.sessionService.getAllNotPayedSessions();
    this.gnewsApiService.getEducationNews();
    this.sessionService.sessionListFromTeacherId.subscribe((sessions) => {
      this.sessionListFromTeacherId = this.takeSessionsForThisWeek(sessions);
      this.groupSessionsByDay(this.sessionListFromTeacherId);
    });

    this.getStudentsCountForTeacher();
    this.getPayedSessionsCount();
    this.getNotPayedSessionsCount();

  }

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  //carousel news
  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  public togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  public onSlide(slideEvent: NgbSlideEvent) {
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

  public takeSessionsForThisWeek(sessions: SessionFromTeacherId[]): SessionFromTeacherId[] {
    let today = new Date();
    let initialDayForThisWeek = new Date(today);
    initialDayForThisWeek.setDate(today.getDate() - today.getDay() + 1); // monday
    initialDayForThisWeek.setHours(0, 0, 0, 0); // 00:00:00 h


    let lastDayForThisWeek = new Date(initialDayForThisWeek);
    lastDayForThisWeek.setDate(initialDayForThisWeek.getDate() + 6); // sunday
    lastDayForThisWeek.setHours(23, 59, 59, 999); // 23:59:59 h

    let sessionsForThisWeek = sessions.filter(session => {
      let sessionDate = new Date(session.session_start);
      return sessionDate >= initialDayForThisWeek && sessionDate <= lastDayForThisWeek;
    });
    return sessionsForThisWeek;
  }

  private groupSessionsByDay(sessions: SessionFromTeacherId[]): void {
    this.sessionsByDay = sessions.reduce((acc, session) => {
      const day = new Date(session.session_start).toLocaleDateString('es-ES', { weekday: 'long' });
      acc[day] = acc[day] || [];
      acc[day].push(session);
      return acc;
    }, {} as { [day: string]: SessionFromTeacherId[] });
  }

  /**
 * Returns an array containing the keys of the provided object.
 * @param obj The object whose keys will be returned.
 * @returns An array of strings representing the keys of the object.
 */
  public getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  public getStudentsCountForTeacher() {
    this.students.subscribe(student => {
      this.studentCount = student.length;
    });
  }

  public getPayedSessionsCount() {

    this.payedSession.subscribe((session) => {
      this.payedSessionCount = session.length
    })
  }

  public getNotPayedSessionsCount() {
    this.notPayedSession.subscribe(session => {
      this.notPayedSessionCount = session.length;
    });
  }

  public openStudentListModal() {
    this.modalService.open(ModalStudentListComponent, {
      centered: true,
      backdrop: 'static',
    });
  }

  public openSessionDetailsModal(selectedSessionId: number) {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ModalSessionDetailsComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.selectedSessionId = selectedSessionId; //get the id_session from selected session
    modalRef.componentInstance.selectedStudentId = this.selectedStudentId;
  }
}
