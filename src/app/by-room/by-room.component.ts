import { Component, OnInit, Renderer2 } from '@angular/core';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventRoomInterface } from '../data/eventRoomInterface';

@Component({
  selector: 'app-by-room',
  templateUrl: './by-room.component.html',
  styleUrls: ['./by-room.component.css']
})
export class ByRoomComponent implements OnInit {
  eventRooms: EventRoomInterface[];
  objName: string;
  toggleName: string;
  toggleDescriptionsName: string;
  onlyUpcoming: boolean;
  showDescriptions: boolean;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2) {
    this.objName = 'events';

    this.toggleUpcoming(true);
    this.toggleDescriptions(true);

    this.sds.byRoomUpdated.subscribe(
      (newData: EventRoomInterface[]) => {
        this.eventRooms = newData;
      }
    );

    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit() {
    this.sds.byRoomUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)] || '[]')
    );
  }

  refresh() {
    this.sds.loadEvents(this.objName);
  }

  toggleUpcoming(init?: boolean) {
    if (!(init === undefined) && (typeof init === 'boolean')) {
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
    if (!(init === undefined) && (typeof init === 'boolean')) {
      this.showDescriptions = !init;
    }
    if (this.showDescriptions) {
      this.toggleDescriptionsName = 'Show Descriptions';
    } else {
      this.toggleDescriptionsName = 'Hide Descriptions';
    }
    this.showDescriptions = !this.showDescriptions;
  }
}
