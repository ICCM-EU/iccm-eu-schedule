import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { RoomsDictionary } from '../data/roomsDictionary';
import { CalEventEmitterInterface } from '../data/calEventEmitterInterface';
import { EventInterface } from '../data/eventInterface';

@Component({
  selector: 'app-schedule-component',
  templateUrl: 'schedule.component.html',
  styleUrls: ['./styles.scss'],
})
export class ScheduleComponent implements OnInit {
  objName: string;

  events: CalendarEvent[] = [];
  users: RoomsDictionary = {};
  roomCount = 0;
  nextEvent: EventInterface;

  initialViewDate: Date = new Date();
  viewDate: Date = new Date();

  constructor(
    public sds: SpreadsheetDS,
    private renderer: Renderer2
  ) {
    this.objName = 'events';

    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit() {
    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        const events: Array<EventInterface> = newData;
        // Initialize
        this.nextEvent = this.sds.getNextEvent(events);
      }
    );
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]'))
    );

    this.sds.calEventsUpdated.subscribe(
      (next: Array<CalEventEmitterInterface>) => {
        if (next != null) {
          for (const data of next) {
            if (data != null) {
              this.events = data.events;
              this.users = data.rooms;

              this.roomCount = Object.keys(this.users).length;
              if (undefined !== this.nextEvent) {
                this.viewDate = startOfDay(this.nextEvent.schedule);
                this.initialViewDate = this.viewDate;
              } else {
                // Fallback to today
                this.viewDate = startOfDay(new Date());
                this.initialViewDate = startOfDay(new Date());
              }
            }
          }
        }
      });
    this.sds.calEventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToCalEventEmitterInterface(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheForCalEvents(this.objName)] || '[]'))
    );
  }

  setToStart() {
    this.viewDate = this.initialViewDate;
  }

  refresh() {
    this.sds.loadEvents(this.objName);
  }
}
