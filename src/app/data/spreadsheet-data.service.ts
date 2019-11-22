import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';
import { EventInterface } from '../eventinterface';
import { EventRoomInterface } from '../eventRoomInterface';

@Injectable()
export class SpreadsheetDS {
  ssIDs: SpreadsheetIDs = new SpreadsheetIDs;
  lastUpdated = new Date();
  // refreshIntervalMin = (36e5 * 6); // 6 hours
  refreshIntervalMin = (60e3 * 5); // 5 Minutes
  // refreshIntervalMin = (60e3 * 1); // 1 Minutes

  events$: Observable<Array<any>>;

  eventsLabel = 'Events';

  eventsUpdated = new EventEmitter<Array<EventInterface>>();
  byRoomUpdated = new EventEmitter<Array<EventRoomInterface>>();

  constructor(public http: HttpClient) {
    // initial loads
    this.refreshAll();
    setInterval( () => { this.refreshStaleData(); }, this.refreshIntervalMin);
  }

  public static setLocal(whatData: any, cacheName: string): void {
    // writes data to local storage
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  refreshStaleData(): void {
    this.refreshAll();
  }

  // google sheets
  getHTTPData_SS(whatTab: string): Observable<Array<any>> {
    // TODO: Remove console log
    // console.log('Getting data from the "' + whatTab + '" objects spreadsheet tab');
    // console.log('URL: ' + this.ssIDs.getTabURL(whatTab));
    // TODO: Return back to ggogle sheets notation
    // return this.http.get<any>(this.ssIDs.getTabURL(whatTab))
    //   .pipe(map(obj => obj.feed.entry));
    return from(this.http.get<any>(this.ssIDs.getTabURL(whatTab)));
  }

  refreshAll(): void {
    this.ssIDs.getObjNames().forEach(objName => {
      this.loadEvents(objName);
    });
    this.lastUpdated = new Date();
  }

  loadEvents(objName: string): void {
    let eventsCount = 0;
    let events: Array<EventInterface> = [];
    const byRoom: Array<EventRoomInterface> = [];
    this.events$ = this.getHTTPData_SS(objName);
    this.events$.subscribe(next => {
      if (next != null) {
        // transform the JSON returned to make it more usable
        events = this.transformEvents(next);
        eventsCount = events.length;
        // Loop through the events and add rooms and events into the rooms
        events.forEach(currentEvent => {
          const currentRoomName: string = currentEvent.Room;
          const roomInArray: EventRoomInterface = byRoom.find(search => search.name === currentRoomName);
          if (roomInArray === undefined) {
            const newRoom: EventRoomInterface = {
              name: currentRoomName,
              events: [
                currentEvent,
              ],
            };
            byRoom.push(newRoom);
          } else {
            roomInArray.events.push(currentEvent);
          }
        });
      }
      SpreadsheetDS.setLocal(events, this.ssIDs.getCacheName(objName));
      SpreadsheetDS.setLocal(byRoom, this.ssIDs.getCacheByRoomName(objName));
      this.eventsLabel = this.buildLabel(eventsCount, objName);

      this.eventsUpdated.emit(events);
      this.byRoomUpdated.emit(byRoom);
    });
  }

  transformEvents(dataReceived: Array<any>): Array<any> {
    const tempArray: EventInterface[] = [];
    const now = new Date;

    for (const i of dataReceived) {
      const cssClassRoom: string = 'room-' + i.room.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const schedule = new Date(i.dateTime);
      let upcoming = true;
      if (schedule <= now) {
        upcoming = false;
      }
      tempArray.push({
        // TODO: Roll back for google sheet
        // Title: i.gsx$Session.$t,
        // Schedule: i.gsx$DateTime.$t,
        Title: i.session,
        Schedule: i.dateTime,
        End: i.endDateTime,
        Time: i.time,
        Room: i.room,
        Speaker: i.speakerspeakersname,
        Upcoming: upcoming,
        cssClassRoom: cssClassRoom,
        Description: i.description,
      });
    }
    return tempArray;
  }

  buildLabel(eventsCount: number, objName: string) {
    let label = '';
    const eventName = this.ssIDs.getLabelName(objName);

    switch (eventsCount) {
      case 0: {
        label = 'No ' + eventName + 's: List';
        break;
      }
      case 1: {
        label = '1 ' + eventName + ': List';
        break;
      }
      default: {
        label = eventsCount + ' ' + eventName + 's: List';
        break;
      }
    }

    return label;
  }
}
