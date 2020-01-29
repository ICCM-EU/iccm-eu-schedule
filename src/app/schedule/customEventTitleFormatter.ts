import { Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  public week(event: CalendarEvent): string {
    return `${event.title} (${event.meta.speaker})`;
  }
}
