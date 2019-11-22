import { Component } from '@angular/core';
import {
  CalendarEvent,
} from 'angular-calendar';
import { colors } from './colors';
import {
  addHours,
  startOfDay,
} from 'date-fns';
import { CalendarUsersDictionary } from './calendarUsersDictionary';

const users: CalendarUsersDictionary = {
  'John Smith': {
    name: 'John Smith',
    colors: colors.yellow,
  },
  'Jane Doe': {
    name: 'Jane Doe',
    colors: colors.blue,
  }
};

@Component({
  selector: 'app-schedule-component',
  templateUrl: 'template.html',
  styleUrls: ['./styles.scss'],
})
export class ScheduleComponent {
  viewDate = new Date();

  events: CalendarEvent[] = [
    {
      title: 'An event',
      color: users['John Smith'].colors,
      start: addHours(startOfDay(new Date()), 5),
      meta: {
        user: users['John Smith'],
      },
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    },
    {
      title: 'Another event',
      color: users['Jane Doe'].colors,
      start: addHours(startOfDay(new Date()), 2),
      meta: {
        user: users['Jane Doe'],
      },
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    },
    {
      title: 'An 3rd event',
      color: users['John Smith'].colors,
      start: addHours(startOfDay(new Date()), 7),
      meta: {
        user: users['John Smith'],
      },
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    }
  ];
}
