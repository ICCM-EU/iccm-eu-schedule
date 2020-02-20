import { Component, OnInit, Renderer2 } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { isUndefined, isBoolean } from 'util';
import { EventInterface } from '../data/eventInterface';
import { EventRoomInterface } from '../data/eventRoomInterface';

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
  nextEventTimeDiff: number;
  nextEventTimeString: string;
  countdownCssClass: string;
  roomList: Array<EventRoomInterface>;
  filterstring: string;
  counterFontSize: string;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';
    this.countdownCssClass = '';
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
    this.sds.nextEventUpdated.subscribe(
      (next: Array<EventInterface>) => {
        if (next != null) {
          for (const nextEvent of next) {
            this.updateNextEventDisplay(nextEvent);
          }
        }
      }
    );
    this.sds.nextEventUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventInterfaceArray(
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
    this.sds.loadEvents(this.objName);
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

  /**
   * Calculate the timediff to the next event
   * @param nextEvent The event to calculate the time diff for
   */
  updateTimediff(nextEvent: EventInterface): void {
    if (!nextEvent) {
      this.nextEventTimeDiff = 0;
      return;
    }
    // Calculate / update the time value
    const thenTime = nextEvent.schedule.getTime();
    // refresh for more precision
    const nowTime = new Date().getTime();
    const timediff: number = thenTime - nowTime;

    if (timediff <= 0) {
      // refresh now, the event has just passed:
      this.sds.refreshAll();
      // } else {
      //   // schedule a refresh when it is time to update the next event
      //   if (timediff < this.sds.refreshIntervalMin) {
      //     setTimeout(() => { this.sds.refreshAll(); }, timediff);
      //   }
    }

    this.nextEventTimeDiff = timediff;
  }

  updateNextEventDisplay(nextEvent: EventInterface): void {
    let timediff: number;

    if (undefined === nextEvent) {
      this.nextEventTimeDiff = 0;
      this.nextEventTimeString = 'No future event.';
      this.countdownCssClass = 'countdown-long';
    } else {
      this.updateTimediff(nextEvent);
      timediff = this.nextEventTimeDiff;

      if (timediff < 0) {
        timediff = -timediff;
      }

      const days: number = timediff / (1000 * 60 * 60 * 24);
      let rest: number = timediff % (1000 * 60 * 60 * 24);
      const hours: number = rest / (1000 * 60 * 60);
      rest = rest % (1000 * 60 * 60);
      const minutes: number = rest / (1000 * 60);
      rest = rest % (1000 * 60);
      const seconds = rest / (1000);

      if (timediff < 1) {
        timediff = -timediff;
        this.nextEventTimeString = 'NOW';
        this.countdownCssClass = 'countdown-10s-uneven';
      } else if (timediff < 2 * 1000) {
        this.nextEventTimeString = 'NOW';
        this.countdownCssClass = 'countdown-10s-uneven';
      } else if (timediff < 3 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-even';
      } else if (timediff < 4 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-uneven';
      } else if (timediff < 5 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-even';
      } else if (timediff < 6 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-uneven';
      } else if (timediff < 7 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-even';
      } else if (timediff < 8 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-uneven';
      } else if (timediff < 9 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-even';
      } else if (timediff < 10 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-uneven';
      } else if (timediff < 11 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-10s-even';
      } else if (timediff < 30 * 1000) {
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-30s';
      } else if (timediff < 60 * 1000) { // coming to less than a minute
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-1m';
      } else if (timediff < 3 * 60 * 1000) { // 3 Minutes
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-3m';
      } else if (timediff < 5 * 60 * 1000) { // 5 Minutes
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-5m';
      } else if (timediff < 60 * 60 * 1000) { // hours and a bit; less than a day
        this.nextEventTimeString = sprintf('%02d:%02d', minutes, seconds);
        this.countdownCssClass = 'countdown-long';
      } else if (timediff < 24 * 60 * 60 * 1000) {
        this.nextEventTimeString = sprintf('%02dh %02dm %02ds', hours, minutes, seconds);
        this.countdownCssClass = 'countdown-long';
      } else { // days and hours (and some minutes)
        this.nextEventTimeString = sprintf('%dd %02dh %02dm', days, hours, minutes);
        this.countdownCssClass = 'countdown-long';
      }
    }
  }
}
