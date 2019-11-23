import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { colors } from './colors';
import { startOfDay } from 'date-fns';
import { CalendarUsersDictionary } from './calendarUsersDictionary';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventRoomInterface } from '../eventRoomInterface';
import { EventInterface } from '../eventInterface';

@Component({
  selector: 'app-schedule-component',
  templateUrl: 'template.html',
  styleUrls: ['./styles.scss'],
})
export class ScheduleComponent implements OnInit {
  objName: string;

  users: CalendarUsersDictionary;
  events: CalendarEvent[];
  viewDate: Date;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';

    this.sds.byRoomUpdated.subscribe((newData: EventRoomInterface[]) => {
        const tempArray: CalendarUsersDictionary = {};
        for (const i of newData) {
          tempArray[i.name] = {
            name: i.name,
            // TODO: Iterate colors
            colors: colors.yellow,
          };
        }
        this.users = tempArray;
      });

    // Set Start Date
    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        if (undefined !== this.sds.nextEvent) {
          this.viewDate = startOfDay(new Date(this.sds.nextEvent.Schedule));
        } else {
          // Fallback to today
          this.viewDate = startOfDay(new Date());
        }

        // Convert events into event view data model
        const tempArray: CalendarEvent[] = [];
        for (const i of newData) {
          tempArray.push({
            title: i.Title,
            color: this.users[i.Room].colors,
            start: i.Schedule,
            end: i.End,
            meta: {
              user: this.users[i.Room],
            },
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
          });
        }
        this.events = tempArray;
      }
    );

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
