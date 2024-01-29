import { Component, inject } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionFromTeacherId } from '../../interfaces/session.interface';
import { ModalSessionDetailsComponent } from '../../modals/modal-session-details/modal-session-details.component';
import { ModalStudentListComponent } from '../../modals/modal-student-list/modal-student-list.component';
import { SessionService } from '../../services/session/session.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { StudentService } from '../../services/student/student-service.service';
import { Observable } from 'rxjs';
import { Student } from '../../interfaces/student.interface';
import { TeacherService } from '../../services/teacher/teacher-service.service';
import { Teacher } from '../../interfaces/teacher.interface';
import { Article } from '../../interfaces/gnewsApi.interface.';
import { GNewsApiService } from '../../services/gnewsApi/gnews-api.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private sessionService = inject(SessionService);
  private modalService = inject(NgbModal);
  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private gnewsApiService = inject(GNewsApiService);


  public sessionListFromTeacherId!: SessionFromTeacherId[];
  public selectedStudentId!: number | null;
  public students!: Observable<Student[]>;
  public teacherData!: Observable<Teacher[]>;
  public educationNews!: Observable<Article[]>;

  constructor(){
    this.students = this.studentService.students;
    this.teacherData = this.teacherService.teacherData;
    this.educationNews = this.gnewsApiService.educationNews;
  }
  ngOnInit(): void {
    this.sessionService.getAllSessionsFromTeacherId();
    this.studentService.getStudentsFromTeacher();
    this.teacherService.getTeacherDataById();
    this.gnewsApiService.getEducationNews();
    this.sessionService.sessionListFromTeacherId.subscribe((sessions) => {
      this.sessionListFromTeacherId = sessions;
      this.loadAllEvents();
    });
  }
  
  public loadAllEvents() {
    if (this.sessionListFromTeacherId) {
      const events = this.sessionListFromTeacherId.map((session) => {
        return {
          title: session.session_name,
          start: session.session_start,
          end: session.session_end,
          id_session: session.id_session,
        }
      });
      //put the events to calendarOptions
      this.calendarOptions.events = events;
    }
  }

  public calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    locale: esLocale,
    timeZone: 'Europe/Madrid',
    fixedWeekCount: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin],
    headerToolbar: {
      left: 'prev',
      center: 'today',
      right: 'next'
    },
    events: [],
    eventClick: this.openSessionDetailsModal.bind(this),
    dateClick: this.openStudentListModal.bind(this),
  };

  public openStudentListModal() {
    this.modalService.open(ModalStudentListComponent, { centered: true });
  }

  public openSessionDetailsModal(event: EventClickArg) {
    this.getStudentIdValue(event.event.extendedProps['id_session']);

    const modalRef = this.modalService.open(ModalSessionDetailsComponent, { centered: true });
    modalRef.componentInstance.selectedSessionId = event.event.extendedProps['id_session']; //get the id_session from selected session
    modalRef.componentInstance.selectedStudentId = this.selectedStudentId;//get de id_student and send to modalsessiondetail

  }

  private getStudentIdValue(selectedSessionId: number) {
    if (this.calendarOptions.events && selectedSessionId) {
      for (const session of this.sessionListFromTeacherId) {
        if (session.id_session === selectedSessionId) {
          this.selectedStudentId = session.id_student;
          console.log('student', this.selectedStudentId)
          break;
        }
      }
    }
  }
}
