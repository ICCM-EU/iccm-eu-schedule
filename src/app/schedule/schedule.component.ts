import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { RoomsDictionary } from '../data/roomsDictionary';

import { colors } from '../data/colors';

@Component({
  selector: 'app-schedule-component',
  templateUrl: 'schedule.component.html',
  styleUrls: ['./styles.scss'],
})
export class ScheduleComponent implements OnInit {
  objName: string;

  // users: RoomsDictionary = {};
  users: RoomsDictionary = {
    'AJAX Room': {
      name: 'AJAX Room',
      color: colors.yellow,
    },
    'BASIC Room': {
      name: 'BASIC Room',
      color: colors.yellow,
    },
    'COBOL Room': {
      name: 'COBOL Room',
      color: colors.yellow,
    },
    'Dining Hall': {
      name: 'Dining Hall',
      color: colors.yellow,
    },
    'Espresso Room': {
      name: 'Espresso Room',
      color: colors.yellow,
    },
  };

  roomCount = 0;
  events: CalendarEvent[] = [];

  initialViewDate: Date = new Date();
  viewDate: Date = new Date();

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';

    this.sds.calEventsUpdated.subscribe(
      (newData: CalendarEvent[]) => {
        this.events = newData;

        for (const event of this.events) {
          event.meta.user = this.users[event.meta.user];
        }

        // this.users = this.sds.rooms;
        this.roomCount = Object.keys(this.users).length;

        if (undefined !== this.sds.nextEvent) {
          this.viewDate = startOfDay(this.sds.nextEvent.schedule);
          this.initialViewDate = startOfDay(this.sds.nextEvent.schedule);
        } else {
          // Fallback to today
          this.viewDate = startOfDay(new Date());
          this.initialViewDate = startOfDay(new Date());
        }
      });

    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit() {
    this.sds.byRoomUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)] || '[]')
    );
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]')
    );
  }

  refresh() {
    this.sds.loadEvents(this.objName);
  }
}
