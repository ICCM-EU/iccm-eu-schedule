import { Component, OnInit, ViewChild } from '@angular/core';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { isUndefined, isBoolean } from 'util';

export interface TheEvent {
  Title: string;
  Schedule: Date;
  Time: string;
  Room: string;
}
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: TheEvent[];
  objName: string;
  toggleName: string;
  onlyUpcoming: boolean;

  constructor(public sds: SpreadsheetDS) {
    this.objName = 'events';

    this.toggleUpcoming(true);

    this.sds.eventsUpdated.subscribe(
      (newData: any) => {
        this.events = newData;
      }
    );
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

  toggleUpcoming(init?: boolean) {
    if (!isUndefined(init) && isBoolean(init)) {
      this.onlyUpcoming = !init;
    }
    if (this.onlyUpcoming) {
      this.toggleName = 'Show Upcoming';
    } else {
      this.toggleName = 'Show All';
    }
    this.onlyUpcoming = ! this.onlyUpcoming;
  }
}
