import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { SessionService } from '../../services/session/session.service';
import { SessionFromTeacherId } from '../../interfaces/session.interface';
import { Observable } from 'rxjs';
import { eventListeners } from '@popperjs/core';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent implements OnInit {


  private sessionService = inject(SessionService);

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
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  handleEventClick(clickInfo: any) {
    alert('event click!' + clickInfo.event.title + ' Hora de inicio: ' + clickInfo.event.start + ' Hora end: ' + clickInfo.event.end) //todo: poner los datos de la sessión
  }

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr) //todo: hacer click, para añadir una nueva sesión.
  }


}
