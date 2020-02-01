import { Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  public week(event: CalendarEvent): string {
    if (event.meta.speaker && event.meta.speaker !== '') {
      return event.title + ' (' + event.meta.speaker + ')';
    } else {
      return event.title;
    }
    // return `${event.title}`;
  }
}
