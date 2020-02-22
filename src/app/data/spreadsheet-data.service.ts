import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';
import { EventInterface } from './eventInterface';
import { EventTimerInterface } from './eventTimerInterface';
import { RoomInterface } from './roomInterface';
import { EventRoomInterface } from './eventRoomInterface';
import { CalendarEvent } from 'angular-calendar';
import { InputEventInterface } from './inputEventInterface';
import { colors } from './colors';
import { RoomsDictionary } from './roomsDictionary';
import { CalEventEmitterInterface } from './calEventEmitterInterface';

const USE_LOCAL_TEST_DATA = false;

@Injectable()
export class SpreadsheetDS {
  static timerStarted = false;

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs(USE_LOCAL_TEST_DATA);
  lastUpdated = new Date();
  refreshIntervalMin = (60e3 * 5); // 5 Minutes

  events$: Observable<Array<InputEventInterface>>;
  eventsLabel = 'Events';

  events: Array<EventInterface> = [];
  byRoom: Array<EventRoomInterface> = [];
  timerEvents: EventTimerInterface = {};
  filterByRoom: string;
  eventsCount = 0;

  eventsUpdated = new EventEmitter<Array<EventInterface>>();
  byRoomUpdated = new EventEmitter<Array<EventRoomInterface>>();
  calEventsUpdated = new EventEmitter<Array<CalEventEmitterInterface>>();
  filterUpdated = new EventEmitter<Array<string>>();
  timerEventUpdated = new EventEmitter<Array<EventTimerInterface>>();

  constructor(public http: HttpClient) {
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
      setInterval(() => {
        this.timerEventUpdated.emit([this.timerEvents]);
      }, 1000);
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
        this.timerEvents = this.updateTimerEvents(this.filterByRoom, this.events, this.byRoom);

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
      SpreadsheetDS.setLocal([this.timerEvents], this.ssIDs.getCacheForNextEvent(objName));
      SpreadsheetDS.setLocal([this.filterByRoom], this.ssIDs.getCacheForFilter(objName));

      this.eventsUpdated.emit(this.events);
      this.byRoomUpdated.emit(this.byRoom);
      this.calEventsUpdated.emit([calEvents]);
      this.timerEventUpdated.emit([this.timerEvents]);
      this.filterUpdated.emit([this.filterByRoom]);
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
    return tempArray.sort((a, b) => a.name < b.name ? 0 : 1);
  }

  transformEventData(i: InputEventInterface,
    roomsDictionary: RoomsDictionary): EventInterface {
    const endTime = new Date(i.gsx$enddatetime.$t);
    const now = new Date;
    let upcoming = true;
    if (endTime <= now) {
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
          speaker: i.gsx$speaker.$t,
          description: i.gsx$description.$t,
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
    this.timerEvents = this.updateTimerEvents(this.filterByRoom, this.events, this.byRoom);

    this.eventsLabel = this.buildLabel(this.eventsCount, objName);

    SpreadsheetDS.setLocal([this.timerEvents], this.ssIDs.getCacheForNextEvent(objName));
    this.timerEventUpdated.emit([this.timerEvents]);

    SpreadsheetDS.setLocal([this.filterByRoom], this.ssIDs.getCacheForFilter(objName));
    this.filterUpdated.emit([this.filterByRoom]);
  }

  private updateTimerEvents(filter: string, events: Array<EventInterface>, byRoom: Array<EventRoomInterface>): EventTimerInterface {
    const timerEvents: EventTimerInterface = {};
    if (undefined !== filter && '' !== filter) {
      const room = byRoom.find(obj => obj.name === filter);
      if (undefined !== room) {
        timerEvents.nextEvent = this.getNextEvent(room.events);
        timerEvents.currentEvent = this.getCurrentEvent(room.events);
      }
    } else {
      timerEvents.nextEvent = this.getNextEvent(events);
      timerEvents.currentEvent = this.getCurrentEvent(events);
    }
    return timerEvents;
  }

  getNextEvent(events: Array<EventInterface>): EventInterface {
    const now = new Date();
    let nextEvent: EventInterface;

    events.forEach(event => {
      if (undefined !== event) {
        // Check if the current event is in the future
        if (new Date(event.schedule) >= now) {
          // Check if the event is nearer than the current or replaces an undefined value.
          if (undefined === nextEvent ||
            new Date(event.schedule) < new Date(nextEvent.schedule)) {
            nextEvent = event;
          }
        }
      }
    });

    return nextEvent;
  }

  getCurrentEvent(events: Array<EventInterface>): EventInterface {
    const now = new Date();
    let currentEvent: EventInterface;

    events.forEach(event => {
      if (undefined !== event) {
        // Check if the current event end is in the future and it has started
        if (new Date(event.end) >= now && new Date(event.schedule) <= now) {
          // Check if the event end is earlier than the current or replaces an undefined value.
          if (undefined === currentEvent ||
            new Date(event.end) < new Date(currentEvent.end)) {
            currentEvent = event;
          }
        }
      }
    });

    return currentEvent;
  }

  getFirstEvent(events: Array<EventInterface>): EventInterface {
    let firstEvent: EventInterface;

    events.forEach(currentEvent => {
      if (undefined !== currentEvent) {
        // Check if the event is earlier than the current or replaces an undefined value.
        if (undefined === firstEvent ||
          new Date(currentEvent.schedule) < new Date(firstEvent.schedule)) {
          firstEvent = currentEvent;
        }
      }
    });

    return firstEvent;
  }

  transformJsonToEventTimerInterfaceArray(events: Array<EventTimerInterface>): Array<EventTimerInterface> {
    events.forEach(entry => {
      if (undefined !== entry && null !== entry) {
        if (undefined !== entry.currentEvent && null !== entry.currentEvent) {
          entry.currentEvent.schedule = new Date(entry.currentEvent.schedule);
          entry.currentEvent.end = new Date(entry.currentEvent.end);
        }
        if (undefined !== entry.nextEvent && null !== entry.nextEvent) {
          entry.nextEvent.schedule = new Date(entry.nextEvent.schedule);
          entry.nextEvent.end = new Date(entry.nextEvent.end);
        }
      }
    });
    return events;
  }

  transformJsonToEventInterfaceArray(events: Array<EventInterface>): Array<EventInterface> {
    events.forEach(event => {
      if (undefined !== event && null !== event) {
        event.schedule = new Date(event.schedule);
        event.end = new Date(event.end);
      }
    });
    return events;
  }

  transformJsonToEventRoomInterfaceArray(rooms: Array<EventRoomInterface>): Array<EventRoomInterface> {
    rooms.forEach(room => {
      room.events.forEach(event => {
        if (undefined !== event && null !== event) {
          event.schedule = new Date(event.schedule);
          event.end = new Date(event.end);
        }
      });
    });
    return rooms;
  }

  transformJsonToCalEventEmitterInterface(items: Array<CalEventEmitterInterface>): Array<CalEventEmitterInterface> {
    items.forEach(item => {
      item.events.forEach(event => {
        if (undefined !== event && null !== event) {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        }
      });
    });
    return items;
  }
}
