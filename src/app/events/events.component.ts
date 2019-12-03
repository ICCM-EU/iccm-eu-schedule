import { Component, OnInit, Renderer2 } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { isUndefined, isBoolean } from 'util';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventInterface } from '../data/eventInterface';
import { EventRoomInterface } from '../data/eventRoomInterface';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Array<EventInterface>;
  objName: string;
  toggleName: string;
  toggleDescriptionsName: string;
  onlyUpcoming: boolean;
  showDescriptions: boolean;
  nextEventTimeDiff: number;
  nextEventTimeString: string;
  countdownCssClass: string;
  roomList: Array<EventRoomInterface>;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';
    this.countdownCssClass = '';

    this.toggleUpcoming(true);
    this.toggleDescriptions(true);

    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit() {
    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        this.events = newData;
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
        }
      }
    );
    this.sds.byRoomUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)] || '[]')
    );

    this.sds.nextEventUpdated.subscribe(
      (nextEvent: EventInterface) => {
        if (undefined !== nextEvent) {
          this.updateNextEventString(nextEvent);
        }
      });
    this.sds.nextEventUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheForNextEvent(this.objName)] || '[]')
    );

    // Let the timer run
    this.sds.startTimer();
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
      console.log('updateTimediff: nextEvent is undefined');
      return;
    }
    console.log('updateTimediff: "' + nextEvent.title + '" at ' + nextEvent.schedule);

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

  updateNextEventString(nextEvent: EventInterface): void {
    let timediff: number;
    console.log('updateNextEventString');

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
      this.nextEventTimeString = 'Next event is now.';
      this.countdownCssClass = 'countdown-10s-uneven';
    } else if (timediff < 2 * 1000) {
      this.nextEventTimeString = 'Next event is now.';
      this.countdownCssClass = 'countdown-10s-uneven';
    } else if (timediff < 3 * 1000) {
      this.nextEventTimeString = 'Next event is in two seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-even';
    } else if (timediff < 4 * 1000) {
      this.nextEventTimeString = 'Next event is in three seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-uneven';
    } else if (timediff < 5 * 1000) {
      this.nextEventTimeString = 'Next event is in four seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-even';
    } else if (timediff < 6 * 1000) {
      this.nextEventTimeString = 'Next event is in five seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-uneven';
    } else if (timediff < 7 * 1000) {
      this.nextEventTimeString = 'Next event is in six seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-even';
    } else if (timediff < 8 * 1000) {
      this.nextEventTimeString = 'Next event is in seven seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-uneven';
    } else if (timediff < 9 * 1000) {
      this.nextEventTimeString = 'Next event is in eight seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-even';
    } else if (timediff < 10 * 1000) {
      this.nextEventTimeString = 'Next event is in nine seconds  (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-uneven';
    } else if (timediff < 11 * 1000) {
      this.nextEventTimeString = 'Next event is in ten seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-10s-even';
    } else if (timediff < 30 * 1000) {
      this.nextEventTimeString = 'Next event is in a few seconds (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-30s';
    } else if (timediff < 60 * 1000) { // coming to less than a minute
      this.nextEventTimeString = 'Next event is in a minute (' + sprintf('%02d', seconds) + 's).';
      this.countdownCssClass = 'countdown-1m';
    } else if (timediff < 3 * 60 * 1000) { // 3 Minutes
      this.nextEventTimeString = 'Next Event in: ' + sprintf('%02d:%02d', minutes, seconds);
      this.countdownCssClass = 'countdown-3m';
    } else if (timediff < 5 * 60 * 1000) { // 5 Minutes
      this.nextEventTimeString = 'Next Event in: ' + sprintf('%02d:%02d', minutes, seconds);
      this.countdownCssClass = 'countdown-5m';
    } else if (timediff < 60 * 60 * 1000) { // hours and a bit; less than a day
      this.nextEventTimeString = 'Next Event in: ' + sprintf('%02dh %02dm', hours, minutes);
      this.countdownCssClass = 'countdown-long';
    } else { // days and hours (and some minutes)
      this.nextEventTimeString = 'Next Event in: ' + sprintf('%dd %02dh %02dm', days, hours, minutes);
      this.countdownCssClass = 'countdown-long';
    }
  }
}
