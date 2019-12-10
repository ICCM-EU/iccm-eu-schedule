import { Injectable } from '@angular/core';
import { CalendarNativeDateFormatter, DateFormatterParams } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class CustomDateFormatter extends CalendarNativeDateFormatter {
  public weekViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    locale = locale;
    return new Intl.DateTimeFormat('ca', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }
}
