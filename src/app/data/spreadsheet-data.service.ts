import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';
import { EventInterface } from './eventInterface';
import { RoomInterface } from './roomInterface';
import { EventRoomInterface } from './eventRoomInterface';
import { CalendarEvent } from 'angular-calendar';
import { InputDataInterface } from './inputDataInterface';
import { colors } from './colors';
import { RoomsDictionary } from './roomsDictionary';

@Injectable()
export class SpreadsheetDS {
  ssIDs: SpreadsheetIDs = new SpreadsheetIDs;
  lastUpdated = new Date();
  // refreshIntervalMin = (36e5 * 6); // 6 hours
  refreshIntervalMin = (60e3 * 5); // 5 Minutes
  // refreshIntervalMin = (60e3 * 1); // 1 Minutes

  events$: Observable<Array<any>>;
  eventsLabel = 'Events';

  nextEvent: EventInterface;

  eventsUpdated = new EventEmitter<Array<EventInterface>>();
  byRoomUpdated = new EventEmitter<Array<EventRoomInterface>>();
  calEventsUpdated = new EventEmitter<Array<CalendarEvent>>();

  roomsDictionary: RoomsDictionary = {};

  constructor(public http: HttpClient) {
    // initial loads
    this.refreshAll();
    setInterval(() => { this.refreshStaleData(); }, this.refreshIntervalMin);
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

    let roomsDictionary: RoomsDictionary = {};

    let events: Array<EventInterface> = [];
    let byRoom: Array<EventRoomInterface> = [];
    let calEvents: Array<CalendarEvent> = [];

    this.events$ = this.getHTTPData_SS(objName);
    this.events$.subscribe(next => {
      if (next != null) {
        const now = new Date();

        // transform the JSON returned to make it more usable
        roomsDictionary = this.initializeRoomDictionary(next);
        byRoom = this.initializeByRooms(next, roomsDictionary);
        events = this.transformEvents(next, roomsDictionary);
        calEvents = this.transformToCalEvents(next, roomsDictionary);

        eventsCount = events.length;
        // Loop through the events and add rooms and events into the rooms
        this.nextEvent = undefined;

        events.forEach(currentEvent => {
          const currentRoomName: string = currentEvent.Room.name;
          const roomInArray: EventRoomInterface = byRoom[currentRoomName];
          const currentSchedule = currentEvent.Schedule;
          if (undefined === this.nextEvent) {
            // Keep at least one event in the list.
            this.nextEvent = currentEvent;
          }
          // Check if the current event is in the future
          const nextSchedule = this.nextEvent.Schedule;
          if (currentSchedule >= now) {
            // Check if the event is nearer than the current or replaces an undefined value.
            if (currentSchedule < nextSchedule) {
              this.nextEvent = currentEvent;
            }
          } else if (currentSchedule > nextSchedule) {
            // if this event is not in the future but later than the currently saved next event
            this.nextEvent = currentEvent;
          }
          if (undefined !== roomInArray) {
            roomInArray.events.push(currentEvent);
          }
        });
      }

      SpreadsheetDS.setLocal(events, this.ssIDs.getCacheName(objName));
      SpreadsheetDS.setLocal(byRoom, this.ssIDs.getCacheByRoomName(objName));
      SpreadsheetDS.setLocal(calEvents, this.ssIDs.getCacheForCalEvents(objName));
      this.eventsLabel = this.buildLabel(eventsCount, objName);

      this.roomsDictionary = roomsDictionary;

      this.eventsUpdated.emit(events);
      this.byRoomUpdated.emit(byRoom);
      this.calEventsUpdated.emit(calEvents);
    });
  }

  initializeRoomDictionary(dataReceived: Array<InputDataInterface>): RoomsDictionary {
    const tempArray: RoomsDictionary = {};
    const colorKeys: string[] = Object.keys(colors);
    let colorIndex = 0;

    for (const i of dataReceived) {
      if (undefined === tempArray[i.room]) {
        const newRoom: RoomInterface = {
          name: i.room,
          color: colors[colorKeys[colorIndex]],
        };
        tempArray[i.room] = newRoom;
        colorIndex++;
        if (colorIndex >= colorKeys.length) {
          colorIndex = 0;
        }
      }
    }
    return tempArray;
  }

  transformEvents(dataReceived: Array<InputDataInterface>,
    roomsDictionary: RoomsDictionary): Array<EventInterface> {
    const tempArray: EventInterface[] = [];

    for (const i of dataReceived) {
      // Check if mandatory items are filled.
      if (undefined !== i.session &&
        undefined !== i.dateTime &&
        undefined !== i.endDateTime) {
        const event = this.transformEventData(i, roomsDictionary);
        tempArray.push(event);
      }
    }
    return tempArray;
  }

  initializeByRooms(dataReceived: Array<InputDataInterface>,
    roomsDictionary: RoomsDictionary): Array<EventRoomInterface> {
    const tempArray: EventRoomInterface[] = [];

    for (const i of dataReceived) {
      if (undefined !== i.session &&
        undefined !== i.dateTime &&
        undefined !== i.endDateTime) {
        const event = this.transformEventData(i, roomsDictionary);
        const currentRoom: EventRoomInterface = tempArray.find(search => search.name === i.room);
        if (undefined === currentRoom) {
          const newRoom: EventRoomInterface = {
            name: i.room,
            color: roomsDictionary[i.room].color,
            events: [event],
          };
          tempArray.push(newRoom);
        } else {
          currentRoom.events.push(event);
        }
      }
    }
    return tempArray;
  }

  transformEventData(i: InputDataInterface,
    roomsDictionary: RoomsDictionary): EventInterface {
    const schedule = new Date(i.dateTime);
    const now = new Date;
    let upcoming = true;
    if (schedule <= now) {
      upcoming = false;
    }

    const event: EventInterface = {
      // TODO: Roll back for google sheet
      // Title: i.gsx$Session.$t,
      // Schedule: i.gsx$DateTime.$t,
      Title: i.session,
      Schedule: new Date(i.dateTime),
      End: new Date(i.endDateTime),
      Time: i.time,
      Room: roomsDictionary[i.room],
      Speaker: i.speakerspeakersname,
      Upcoming: upcoming,
      Description: i.description,
    };
    return event;
  }

  transformToCalEvents(dataReceived: Array<InputDataInterface>,
    roomsDictionary: RoomsDictionary): Array<CalendarEvent> {
    const tempArray: CalendarEvent[] = [];
    for (const i of dataReceived) {
      tempArray.push({
        title: i.session,
        start: new Date(i.dateTime),
        end: new Date(i.endDateTime),
        color: roomsDictionary[i.room].color,
        meta: {
          user: i.room,
        },
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
        draggable: false,
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
