import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';

@Injectable()
export class SpreadsheetDS {

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs;
  lastUpdated = new Date();
  // refreshHowOften = (36e5 * 6); // 6 hours
  refreshHowOften = (60e3 * 5); // 5 Minutes

  events$: Observable<Array<any>>;

  eventsLabel = 'Events';

  eventsUpdated = new EventEmitter<Array<any>>();

  constructor(public http: HttpClient) {
    // initial loads
    this.loadEvents('Events');
    setInterval( () => { this.refreshStaleData(); }, this.refreshHowOften);
  }

  public static setLocal(whatData: any, cacheName: string) {
    // writes data to local storage
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  refreshStaleData() {
    this.refreshAll();
  }

  // google sheets
  getHTTPData_SS(whatTab: string): Observable<Array<any>> {
    // console.log('Getting data from the ' + whatTab + ' spreadsheet tab');
    return this.http.get<any>(this.ssIDs.getTabURL(whatTab))
      .pipe(map(obj => obj.feed.entry));
  }

  getHTTPData_Tabs(): Observable<Array<any>> {
    // console.log('Getting all tabs in the spreadsheet');
    return this.http.get<any>(this.ssIDs.getAllTabsURL())
      .pipe(map(obj => obj.feed.entry));
  }

  refreshAll() {
    this.loadEvents('Events');
    this.lastUpdated = new Date();
  }

  loadEvents(objName: string) {
    let eventsCount = 0;
    let events: Array<any> = [];
    this.events$ = this.getHTTPData_SS(objName);
    this.events$.subscribe(next => {

      if (next != null) {
        // transform the JSON returned to make it more usable
        events = this.transformEvents(next);
        eventsCount = events.length;
      }
      SpreadsheetDS.setLocal(events, this.ssIDs.getCacheName(objName));
      this.eventsLabel = this.buildLabel(eventsCount, objName);
      this.eventsUpdated.emit(events);

    });

  }

  transformEvents(dataReceived: Array<any>): Array<any> {
    const tempArray: Array<any> = [];
    for (const i of dataReceived) {
      tempArray.push({
        Name: i.gsx$name.$t,
        Breed: i.gsx$breed.$t,
        Birthdate: i.gsx$birthdate.$t,
        CurrentAge: i.gsx$currentage.$t
      });
    }
    return tempArray;
  }

  buildLabel(eventsCount: number, objName: string) {
    let label = '';
    const eventName = this.ssIDs.getLabelName(objName);

    switch (eventsCount) {
      case 0: {
        label = 'No ' + eventName + 's';
        break;
      }
      case 1: {
        label = '1 ' + eventName;
        break;
      }
      default: {
        label = eventsCount + ' ' + eventName + 's';
        break;
      }
    }

    return label;
  }
}
