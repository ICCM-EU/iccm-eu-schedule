import { Component } from '@angular/core';
import {
  CalendarEvent,
} from 'angular-calendar';
import { colors } from './colors';
import {
  addHours,
  startOfDay,
} from 'date-fns';

const users = [
  {
    id: 0,
    name: 'John smith',
    color: colors.yellow
  },
  {
    id: 1,
    name: 'Jane Doe',
    color: colors.blue
  }
];

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
      color: users[0].color,
      start: addHours(startOfDay(new Date()), 5),
      meta: {
        user: users[0]
      },
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    },
    {
      title: 'Another event',
      color: users[1].color,
      start: addHours(startOfDay(new Date()), 2),
      meta: {
        user: users[1]
      },
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    },
    {
      title: 'An 3rd event',
      color: users[0].color,
      start: addHours(startOfDay(new Date()), 7),
      meta: {
        user: users[0]
      },
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    }
  ];
}
