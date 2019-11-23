import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { colors } from './colors';
import { addHours, startOfDay } from 'date-fns';
import { CalendarUsersDictionary } from './calendarUsersDictionary';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventInterface } from '../eventInterface';

@Component({
  selector: 'app-schedule-component',
  templateUrl: 'template.html',
  styleUrls: ['./styles.scss'],
})
export class ScheduleComponent implements OnInit {
  users: CalendarUsersDictionary;

  viewDate = new Date();
  objName: string;
  events: CalendarEvent[];

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';

    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        let loadedEvents: EventInterface[];
        loadedEvents = newData;
        // TODO: Get list of rooms and their properties
        this.users = {
          'John Smith': {
            name: 'John Smith',
            colors: colors.yellow,
          },
        };
        // TODO: Convert loaded events into event view data model
        this.events = [
          {
            title: 'An event',
            color: this.users['John Smith'].colors,
            start: addHours(startOfDay(new Date()), 5),
            end: addHours(startOfDay(new Date()), 6),
            meta: {
              user: this.users['John Smith'],
            },
            resizable: {
              beforeStart: false,
              afterEnd: false
            },
            draggable: false
          },
        ];

        // TODO: Set Start Date
      }
    );

    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit() {
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]')
    );
  }

  refresh() {
    this.sds.loadEvents(this.objName);
  }
}
