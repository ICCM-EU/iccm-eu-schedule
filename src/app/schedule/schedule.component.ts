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
  nextEvents: Array<EventInterface>;
  firstEvent: EventInterface;

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
        this.nextEvents = this.sds.getNextEvents(events);
        this.firstEvent = this.sds.getFirstEvent(events);
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
              if (this.nextEvents.length !== 0) {
                this.viewDate = startOfDay(this.nextEvents[0].schedule);
              } else {
                // Fallback to first event
                if (undefined !== this.firstEvent) {
                  this.viewDate = startOfDay(this.firstEvent.schedule);
                } else {
                  // Fallback to today
                  this.viewDate = startOfDay(new Date());
                }
              }
              this.initialViewDate = this.viewDate;
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
    this.sds.triggerSheetDataUpdate(this.objName);
  }
}
