import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { RoomsDictionary } from '../data/roomsDictionary';

@Component({
  selector: 'app-schedule-component',
  templateUrl: 'template.html',
  styleUrls: ['./styles.scss'],
})
export class ScheduleComponent implements OnInit {
  objName: string;

  users: RoomsDictionary;
  roomCount: number;
  events: CalendarEvent[];
  viewDate: Date;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';

    this.sds.calEventsUpdated.subscribe(
      (newData: CalendarEvent[]) => {
        this.events = newData;

        this.users = this.sds.roomsDictionary;
        this.roomCount = Object.keys(this.users).length;

        if (undefined !== this.sds.nextEvent) {
          this.viewDate = startOfDay(this.sds.nextEvent.Schedule);
        } else {
          // Fallback to today
          this.viewDate = startOfDay(new Date());
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
