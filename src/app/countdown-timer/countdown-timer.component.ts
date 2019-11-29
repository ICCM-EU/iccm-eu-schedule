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
  toggleDescriptionsName: string;
  onlyUpcoming: boolean;
  showDescriptions: boolean;
  nextEvent: EventInterface;
  nextEventTimeDiff: number;
  nextEventTimeString: string;
  countdownCssClass: string;
  filterByRoom: string;
  roomList: Array<EventRoomInterface>;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';
    this.countdownCssClass = '';

    this.toggleUpcoming(true);
    this.toggleDescriptions(true);

    this.renderer.setStyle(document.body, 'background-color', 'black');
  }

  ngOnInit() {
    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        this.events = newData;
        // Initialize
        this.getNextEvent();
      }
    );
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]')
    );
    this.sds.byRoomUpdated.subscribe(
      (newData: EventRoomInterface[]) => {
        if (undefined !== newData) {
          this.roomList = newData;
          // Initialize
          this.getNextEvent();
        }
      }
    );
    this.sds.byRoomUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)] || '[]')
    );

    // Let the timer run
    setInterval(() => { this.updateNextEventString(); }, 1000);
  }

  refresh() {
    this.sds.loadEvents(this.objName);
  }

  toggleUpcoming(init?: boolean) {
    if (!isUndefined(init) && isBoolean(init)) {
      this.onlyUpcoming = !init;
    }
    if (this.onlyUpcoming) {
      this.toggleName = 'Show Upcoming';
    } else {
      this.toggleName = 'Show All';
    }
    this.onlyUpcoming = !this.onlyUpcoming;
  }

  toggleDescriptions(init?: boolean) {
    if (!isUndefined(init) && isBoolean(init)) {
      this.showDescriptions = !init;
    }
    if (this.showDescriptions) {
      this.toggleDescriptionsName = 'Show Descriptions';
    } else {
      this.toggleDescriptionsName = 'Hide Descriptions';
    }
    this.showDescriptions = !this.showDescriptions;
  }

  getNextEvent(): void {
    let events: Array<EventInterface>;

    if (undefined !== this.filterByRoom && '' !== this.filterByRoom) {
      const room = this.roomList.find(obj => obj.name === this.filterByRoom);
      if (undefined !== room) {
        events = room.events;
        // console.log('filterByRoom is "' + this.filterByRoom + '"');
      } else {
        // console.log('filterByRoom is "' + this.filterByRoom + '" but not found in roomList');
      }
    } else {
      events = this.events;
      // console.log('filterByRoom is empty, using this.events');
    }
    // console.log('Found ' + events.length + ' events');

    // Identify the next event
    this.nextEvent = this.sds.getNextEvent(events);

    this.updateNextEventString();
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
    const thenTime = new Date(nextEvent.schedule).getTime();
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

  updateNextEventString(): void {
    let timediff: number;
    const nextEvent: EventInterface = this.nextEvent;

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
