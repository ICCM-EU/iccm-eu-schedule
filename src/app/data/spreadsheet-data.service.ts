import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';
import { EventInterface } from './eventInterface';
import { RoomInterface } from './roomInterface';
import { EventRoomInterface } from './eventRoomInterface';
import { CalendarEvent } from 'angular-calendar';
import { InputEventInterface } from './inputEventInterface';
import { colors } from './colors';
import { RoomsDictionary } from './roomsDictionary';
import { CalEventEmitterInterface } from './calEventEmitterInterface';

@Injectable()
export class SpreadsheetDS {
  static timerStarted = false;

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs;
  lastUpdated = new Date();
  refreshIntervalMin = (60e3 * 5); // 5 Minutes

  events$: Observable<Array<InputEventInterface>>;
  eventsLabel = 'Events';

  events: Array<EventInterface> = [];
  byRoom: Array<EventRoomInterface> = [];
  nextEvent: EventInterface;
  filterByRoom = '';
  eventsCount = 0;

  eventsUpdated = new EventEmitter<Array<EventInterface>>();
  byRoomUpdated = new EventEmitter<Array<EventRoomInterface>>();
  calEventsUpdated = new EventEmitter<Array<CalEventEmitterInterface>>();
  filterUpdated = new EventEmitter<Array<string>>();
  nextEventUpdated = new EventEmitter<Array<EventInterface>>();

  constructor(public http: HttpClient) {
    this.filterByRoom = '';

    // initial loads
    this.refreshAll();
    setInterval(() => { this.refreshStaleData(); }, this.refreshIntervalMin);
  }

  public static setLocal(whatData: any, cacheName: string): void {
    // writes data to local storage
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  public startTimer() {
    if (!SpreadsheetDS.timerStarted) {
      // Let the timer run
      // setInterval(() => {
      //   this.nextEventUpdated.emit([this.nextEvent]);
      // }, 1000);
      SpreadsheetDS.timerStarted = true;
    }
  }

  refreshStaleData(): void {
    this.refreshAll();
  }

  // google sheets
  getHTTPData_SS(whatTab: string): Observable<Array<any>> {
    return this.http.get<any>(this.ssIDs.getTabURL(whatTab))
      .pipe(map(obj => obj.feed.entry));
  }

  refreshAll(): void {
    this.ssIDs.getObjNames().forEach(objName => {
      this.loadEvents(objName);
    });
    this.lastUpdated = new Date();
  }

  loadEvents(objName: string): void {
    const calEvents: CalEventEmitterInterface = {
      events: [],
      rooms: {},
    };

    this.events$ = this.getHTTPData_SS(objName);
    this.events$.subscribe(data => {
      if (undefined !== data) {
        // transform the JSON returned to make it more usable
        calEvents.rooms = this.initializeRoomDictionary(data);
        this.byRoom = this.initializeByRooms(data, calEvents.rooms);
        this.events = this.transformEvents(data, calEvents.rooms);
        calEvents.events = this.transformToCalEvents(data, calEvents.rooms);
        this.nextEvent = this.updateNextEvent(this.filterByRoom, this.events, this.byRoom);

        this.eventsCount = this.events.length;
        // Loop through the events and add rooms and events into the rooms
        let lastEvent: EventInterface;

        this.events.forEach(currentEvent => {
          if (undefined !== currentEvent) {
            const roomInArray: EventRoomInterface = this.byRoom[currentEvent.room.name];
            // Check if the current event is in the future
            if (undefined === lastEvent || currentEvent.schedule < lastEvent.schedule) {
              lastEvent = currentEvent;
            }
            if (undefined !== roomInArray) {
              roomInArray.events.push(currentEvent);
            }
          }
        });
      }
      
      this.eventsLabel = this.buildLabel(this.eventsCount, objName);

      SpreadsheetDS.setLocal(this.events, this.ssIDs.getCacheName(objName));
      SpreadsheetDS.setLocal(this.byRoom, this.ssIDs.getCacheByRoomName(objName));
      SpreadsheetDS.setLocal([calEvents], this.ssIDs.getCacheForCalEvents(objName));
      SpreadsheetDS.setLocal([this.nextEvent], this.ssIDs.getCacheForNextEvent(objName));

      this.eventsUpdated.emit(this.events);
      this.byRoomUpdated.emit(this.byRoom);
      this.calEventsUpdated.emit([calEvents]);
      this.nextEventUpdated.emit([this.nextEvent]);
    });
  }

  initializeRoomDictionary(dataReceived: Array<InputEventInterface>): RoomsDictionary {
    const tempArray: RoomsDictionary = {};
    const colorKeys: string[] = Object.keys(colors);
    let colorIndex = 0;

    for (const i of dataReceived) {
      if ((undefined !== i.gsx$room.$t) && (undefined === tempArray[i.gsx$room.$t])) {
        const newRoom: RoomInterface = {
          name: i.gsx$room.$t,
          color: colors[colorKeys[colorIndex]],
        };
        tempArray[i.gsx$room.$t] = newRoom;
        colorIndex++;
        if (colorIndex >= colorKeys.length) {
          colorIndex = 0;
        }
      }
    }
    return tempArray;
  }

  transformEvents(dataReceived: Array<InputEventInterface>,
    roomsDictionary: RoomsDictionary): Array<EventInterface> {
    const tempArray: EventInterface[] = [];

    for (const i of dataReceived) {
      // Check if mandatory items are filled.
      if (undefined !== i.gsx$session.$t &&
        undefined !== i.gsx$datetime.$t &&
        undefined !== i.gsx$enddatetime.$t) {
        const event = this.transformEventData(i, roomsDictionary);
        tempArray.push(event);
      }
    }
    return tempArray;
  }

  initializeByRooms(dataReceived: Array<InputEventInterface>,
    roomsDictionary: RoomsDictionary): Array<EventRoomInterface> {
    const tempArray: EventRoomInterface[] = [];

    for (const i of dataReceived) {
      if (undefined !== i.gsx$session.$t &&
        undefined !== i.gsx$datetime.$t &&
        undefined !== i.gsx$enddatetime.$t) {
        const event = this.transformEventData(i, roomsDictionary);
        const currentRoom: EventRoomInterface = tempArray.find(search => search.name === i.gsx$room.$t);
        if (undefined === currentRoom) {
          const newRoom: EventRoomInterface = {
            name: i.gsx$room.$t,
            color: roomsDictionary[i.gsx$room.$t].color,
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

  transformEventData(i: InputEventInterface,
    roomsDictionary: RoomsDictionary): EventInterface {
    const schedule = new Date(i.gsx$datetime.$t);
    const now = new Date;
    let upcoming = true;
    if (schedule <= now) {
      upcoming = false;
    }

    const event: EventInterface = {
      // TODO: Roll back for google sheet
      // Title: i.gsx$Session.$t,
      // Schedule: i.gsx$datetime.$t,
      title: i.gsx$session.$t,
      schedule: new Date(i.gsx$datetime.$t),
      end: new Date(i.gsx$enddatetime.$t),
      time: i.gsx$time.$t,
      room: roomsDictionary[i.gsx$room.$t],
      speaker: i.gsx$speaker.$t,
      upcoming: upcoming,
      description: i.gsx$description.$t,
    };
    return event;
  }

  transformToCalEvents(dataReceived: Array<InputEventInterface>,
    roomsDictionary: RoomsDictionary): Array<CalendarEvent> {
    const tempArray: CalendarEvent[] = [];
    for (const i of dataReceived) {
      tempArray.push({
        title: i.gsx$session.$t,
        start: new Date(i.gsx$datetime.$t),
        end: new Date(i.gsx$enddatetime.$t),
        color: roomsDictionary[i.gsx$room.$t].color,
        meta: {
          user: roomsDictionary[i.gsx$room.$t],
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

  updateFilter(filter: string, objName: string) {
    this.filterByRoom = filter;
    this.nextEvent = this.updateNextEvent(this.filterByRoom, this.events, this.byRoom);

    SpreadsheetDS.setLocal(this.nextEvent, this.ssIDs.getCacheForNextEvent(objName));
    this.eventsLabel = this.buildLabel(this.eventsCount, objName);

    SpreadsheetDS.setLocal([this.nextEvent], this.ssIDs.getCacheForNextEvent(objName));
    this.nextEventUpdated.emit([this.nextEvent]);
  }

  private updateNextEvent(filter: string, events: Array<EventInterface>, byRoom: Array<EventRoomInterface>): EventInterface {
    if (undefined !== filter && '' !== filter) {
      const room = byRoom.find(obj => obj.name === filter);
      if (undefined !== room) {
        return this.getNextEvent(room.events);
      } else {
        return null;
      }
    } else {
      return this.getNextEvent(events);
    }
  }

  getNextEvent(events: Array<EventInterface>): EventInterface {
    const now = new Date();
    let nextEvent: EventInterface;

    events.forEach(currentEvent => {
      if (undefined !== currentEvent) {
        // Check if the current event is in the future
        if (new Date(currentEvent.schedule) >= now) {
          // Check if the event is nearer than the current or replaces an undefined value.
          if (undefined === nextEvent ||
            new Date(currentEvent.schedule) < new Date(nextEvent.schedule)) {
            nextEvent = currentEvent;
          }
        }
      }
    });

    return nextEvent;
  }

  transformJsonToEventInterfaceArray(events: Array<EventInterface>): Array<EventInterface> {
    events.forEach(event => {
      event.schedule = new Date(event.schedule);
      event.end = new Date(event.end);
    });
    return events;
  }

  transformJsonToEventRoomInterfaceArray(rooms: Array<EventRoomInterface>): Array<EventRoomInterface> {
    rooms.forEach(room => {
      room.events.forEach(event => {
        event.schedule = new Date(event.schedule);
        event.end = new Date(event.end);
      });
    });
    return rooms;
  }

  transformJsonToCalEventEmitterInterface(items: Array<CalEventEmitterInterface>): Array<CalEventEmitterInterface> {
    items.forEach(item => {
      item.events.forEach(event => {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
      });
    });
    return items;
  }
}
