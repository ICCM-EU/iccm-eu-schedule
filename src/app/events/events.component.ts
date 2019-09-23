import { Component, OnInit } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { isUndefined, isBoolean } from 'util';
import { EventInterface } from '../eventinterface';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: EventInterface[];
  objName: string;
  toggleName: string;
  toggleDescriptionsName: string;
  onlyUpcoming: boolean;
  showDescriptions: boolean;
  nextEventTimeOffset: string;

  constructor(public sds: SpreadsheetDS) {
    this.objName = 'events';

    this.toggleUpcoming(true);
    this.toggleDescriptions(true);

    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        this.events = newData;
      }
    );

  }

  ngOnInit() {
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]')
    );
    this.nextEventTimeOffset = this.getNextEventTimeOffset();
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

  getNextEventTimeOffset(): string {
    let i = 0;
    let nextEvent: EventInterface;
    const now = new Date();
    let then: Date;

    do {
      nextEvent = this.events[i];
      then = new Date(nextEvent.Schedule);
      i++;
    } while (i < this.events.length && then <= now);

    if (i >= this.events.length) {
      return 'No event scheduled';
    } else {
      let timediff: number = then.getTime() - now.getTime();
      let negative = '';
      if (timediff < 0) {
        negative = '-';
        timediff = -timediff;
      }

      const days: number = timediff / (1000 * 60 * 60 * 24);
      let rest: number = timediff % (1000 * 60 * 60 * 24);

      const hours: number = rest / (1000 * 60 * 60);
      rest = rest % (1000 * 60 * 60);

      const minutes: number = rest / (1000 * 60);
      rest = rest % (1000 * 60);

      const seconds = rest / (1000);
      return 'Next Event in: ' + negative + sprintf('%dd %02d:%02d:%02d', days, hours, minutes, seconds)
        + ' (at ' + nextEvent.Schedule + ')';
    }
  }
}
