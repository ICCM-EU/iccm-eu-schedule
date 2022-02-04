import { Component, OnInit, Renderer2 } from '@angular/core';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventInterface } from '../data/eventInterface';
import { EventTimerInterface } from '../data/eventTimerInterface';
import { EventRoomInterface } from '../data/eventRoomInterface';
import { TimerDisplay } from '../data/timerDisplay';
import { TextManager } from '../data/textManager';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css']
})
export class CountdownTimerComponent implements OnInit {
  events: Array<EventInterface>;
  objName: string;
  toggleName: string;
  showDescriptions: boolean;
  timerDisplay: TimerDisplay;
  roomList: Array<EventRoomInterface>;
  filterstring: string;
  counterFontSize: string;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';
    this.timerDisplay = {
      timerCssClass: '',
      timerString: '',
    };
    this.filterstring = '';

    this.renderer.setStyle(document.body, 'background-color', 'black');

    this.counterFontSize = '180px';
  }

  ngOnInit() {
    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        this.events = newData;
      }
    );
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]'))
    );
    this.sds.byRoomUpdated.subscribe(
      (newData: EventRoomInterface[]) => {
        if (undefined !== newData) {
          this.roomList = newData;
        }
      }
    );
    this.sds.byRoomUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventRoomInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)] || '[]'))
    );
    this.sds.timerEventUpdated.subscribe(
      (next: Array<EventTimerInterface>) => {
        let thenTime: Date = undefined;
        if (next != null) {
          for (const entry of next) {
            // If the current event has an end time, use it
            // Otherwise, use the start time of the next event to display
            if (entry != null && entry.currentEvents) {
              entry.currentEvents.forEach(event => {
                
                if (event && event.end) {
                  if (undefined === thenTime || thenTime > event.end) {
                    thenTime = event.end;
                  }
                }
              })
              if (undefined === thenTime) {
                entry.nextEvents.forEach(event => {
                  if (event && event.schedule) {
                    if (undefined === thenTime || thenTime > event.schedule) {
                      thenTime = event.schedule;
                    }
                  }
                })
              }
            }
          }
          this.timerDisplay = TextManager.getTimerDisplay(thenTime, this.sds);
        }
      }
    );
    this.sds.timerEventUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventTimerInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheForNextEvent(this.objName)] || '[]'))
    );
    this.sds.filterUpdated.subscribe(
      (next: Array<string>) => {
        if (next != null) {
          for (const filterString of next) {
            if (filterString != null && filterString !== '') {
              this.filterstring = filterString;
            } else {
              this.filterstring = 'All Rooms';
            }
          }
        }
      }
    );
    this.sds.filterUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheForFilter(this.objName)] || '[]')
    );

    // Let the timer run
    this.sds.startTimer();

    this.counterFontSize = this.getCounterFontSize(window.innerWidth);
  }

  refresh() {
    this.sds.triggerSheetDataUpdate(this.objName);
  }

  onResize(innerWidth: number) {
    this.counterFontSize = this.getCounterFontSize(innerWidth);
  }

  getCounterFontSize(innerWidth: number): string {
    // Number of characters expected in maximum case
    const numChars = 12;

    // defensife for browser-supplied values
    if (!innerWidth) {
      innerWidth = 0;
    }
    innerWidth = innerWidth - 70;
    if (innerWidth < numChars * 8) {
      innerWidth = numChars * 8;
    }
    // font-size is height, but we calculated width; apply factor character height to width to window width.
    return Math.floor(innerWidth * (3 / 2) / numChars) + 'px';
  }

  updateFilter(updatedValue: string): void {
    this.sds.updateFilter(updatedValue, this.objName);
  }
}
