import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { SessionService } from '../../services/session/session.service';
import { SessionFromTeacherId } from '../../interfaces/session.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalStudentListComponent } from '../../modals/modal-student-list/modal-student-list.component';
import { ModalSessionDetailsComponent } from '../../modals/modal-session-details/modal-session-details.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent implements OnInit {
  private sessionService = inject(SessionService);
  private modalService = inject(NgbModal);


  public sessionListFromTeacherId!: SessionFromTeacherId[];


  ngOnInit(): void {
    this.sessionService.getAllSessionsFromTeacherId();
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
    initialView: 'dayGridMonth',
    locale: esLocale,
    timeZone: 'Europe/Madrid',
    fixedWeekCount: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.openSessionDetailsModal.bind(this),
    dateClick: this.openStudentListModal.bind(this),
  };

  public openStudentListModal() {
    this.modalService.open(ModalStudentListComponent, { centered: true });
  }

  public openSessionDetailsModal(event: EventClickArg) {
    const modalRef = this.modalService.open(ModalSessionDetailsComponent, { centered: true });
    modalRef.componentInstance.selectedSessionId = event.event.extendedProps['id_session']; //get the id_session from selected session
  }
}
