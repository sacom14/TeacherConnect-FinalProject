import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {

  calendarOptions: CalendarOptions = {
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
    events: [ //todo: hacerlo dinámico con la base de datos
      {
        title: 'event 1',
        start: '2024-01-25 08:10:00',
        end: '2024-01-25 09:10:00',
      },
      {
        title: 'event 2',
        start: '2024-01-25 09:10:00',
        end: '2024-01-26 11:10:00',
      },
    ],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  handleEventClick(clickInfo: any){
    alert('event click!' + clickInfo.event.title + ' Hora de inicio: ' + clickInfo.event.start + ' Hora end: ' + clickInfo.event.end ) //todo: poner los datos de la sessión
  }

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr) //todo: hacer click, para añadir una nueva sesión. 
  }


}
