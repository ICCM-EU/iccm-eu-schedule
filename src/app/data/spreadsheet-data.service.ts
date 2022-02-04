import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';
import { EventInterface } from './eventInterface';
import { EventTimerInterface } from './eventTimerInterface';
import { RoomInterface } from './roomInterface';
import { EventRoomInterface } from './eventRoomInterface';
import { CalendarEvent } from 'angular-calendar';
import { EventInputInterface } from './eventInputInterface';
import { colors } from './colors';
import { RoomsDictionary } from './roomsDictionary';
import { CalEventEmitterInterface } from './calEventEmitterInterface';

import { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

@Injectable()
export class SpreadsheetDS {
  static timerStarted = false;

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs();
  lastUpdated = new Date();
  refreshIntervalMin = (60e3 * 5); // 5 Minutes

  eventsLabel = 'Events';

  rawEvents: Array<EventInputInterface> = [];
  events: Array<EventInterface> = [];
  byRoom: Array<EventRoomInterface> = [];
  timerEvents: EventTimerInterface = {
    currentEvents: [],
    nextEvents: []
  };
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

  refreshAll() {
    this.ssIDs.getObjNames().forEach(objName => {
      this.triggerSheetDataUpdate(objName);
    });
    this.lastUpdated = new Date();
  }

  // google sheets
  async triggerSheetDataUpdate(objName: string) {
    // await this.ssIDs.printSheetTitle();
    const tabName = this.ssIDs.getTabName(objName);
    let workSheet: GoogleSpreadsheetWorksheet = await this.ssIDs.getSheetsByTitle(tabName);
    if (Array.isArray(workSheet)) {
      console.log("Worksheet " + tabName + " not unique.");
      return;
    }
    if (workSheet === undefined) {
      console.log("Worksheet " + tabName + " not found.");
      return;
    }
    let rows: Array<GoogleSpreadsheetRow> = await workSheet.getRows();
    if (rows.length < 1) {
      console.log("Rows in " + tabName + " not found.");
      return;
    }

    this.rawEvents = [];
    rows.forEach(row => {
      this.rawEvents.push({
        title:this.ssIDs.getColumnValue(row, "Session"),
        time: this.ssIDs.getColumnValue(row, "Date & Time"),
        end: this.ssIDs.getColumnValue(row, "End Date & Time"),
        speaker: this.ssIDs.getColumnValue(row, "Speaker"),
        room: this.ssIDs.getColumnValue(row, "Room"),
        description: this.ssIDs.getColumnValue(row, "Description"),
      });
    });

    const calEvents: CalEventEmitterInterface = {
      events: [],
      rooms: {},
    };
    // if (undefined !== data) {
    // transform the data to make it more usable
    calEvents.rooms = this.initializeRoomDictionary(this.rawEvents);
    this.byRoom = this.initializeByRooms(this.rawEvents, calEvents.rooms);
    this.events = this.transformEvents(this.rawEvents, calEvents.rooms);
    calEvents.events = this.transformToCalEvents(this.events, calEvents.rooms);
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
    // }

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
  }

  transformEvents(events: Array<EventInputInterface>,
      roomsDictionary: RoomsDictionary): Array<EventInterface> {
    const tempArray: EventInterface[] = [];

    for (const event of events) {
      // Check if mandatory items are filled.
      if (undefined !== event.title &&
        undefined !== event.time &&
        undefined !== event.end) {
        const newEvent = this.transformEventData(event, roomsDictionary);
        tempArray.push(newEvent);
      }
    }
    return tempArray;
  }

  initializeRoomDictionary(events: Array<EventInputInterface>): RoomsDictionary {
    const tempArray: RoomsDictionary = {};
    const colorKeys: string[] = Object.keys(colors);
    let colorIndex = 0;

    for (const event of events) {
      if ((undefined !== event.room) && (undefined === tempArray[event.room])) {
        const newRoom: RoomInterface = {
          name: event.room,
          color: colors[colorKeys[colorIndex]],
        };
        tempArray[event.room] = newRoom;
        colorIndex++;
        if (colorIndex >= colorKeys.length) {
          colorIndex = 0;
        }
      }
    }
    return tempArray;
  }

  initializeByRooms(events: Array<EventInputInterface>,
      roomsDictionary: RoomsDictionary): Array<EventRoomInterface> {
    const tempArray: EventRoomInterface[] = [];

    for (const event of events) {
      if (undefined !== event.title &&
        undefined !== event.time &&
        undefined !== event.end) {
        const newEvent = this.transformEventData(event, roomsDictionary);
        const currentRoom: EventRoomInterface = tempArray.find(
          search => search.name === event.room);
        if (undefined === currentRoom) {
          const newRoom: EventRoomInterface = {
            name: event.room,
            color: roomsDictionary[event.room].color,
            events: [newEvent],
          };
          tempArray.push(newRoom);
        } else {
          currentRoom.events.push(newEvent);
        }
      }
    }
    return tempArray.sort((a, b) => a.name < b.name ? 0 : 1);
  }

  transformEventData(event: EventInputInterface,
      roomsDictionary: RoomsDictionary): EventInterface {
    const endTime = new Date(event.end);
    const now = new Date;
    let upcoming = true;
    if (endTime <= now) {
      upcoming = false;
    }

    const newEvent: EventInterface = {
      // Title: i.gsx$Session.$t,
      // Schedule: i.gsx$datetime.$t,
      title: event.title,
      schedule: new Date(event.time),
      end: new Date(event.end),
      time: event.time,
      room: roomsDictionary[event.room],
      speaker: event.speaker,
      upcoming: upcoming,
      description: event.description,
    };
    return newEvent;
  }

  transformToCalEvents(events: Array<EventInterface>,
      roomsDictionary: RoomsDictionary): Array<CalendarEvent> {
    const tempArray: CalendarEvent[] = [];
    for (const event of events) {
      tempArray.push({
        title: event.title,
        start: new Date(event.time),
        end: new Date(event.end),
        color: roomsDictionary[event.room.name].color,
        meta: {
          user: roomsDictionary[event.room.name],
          speaker: event.speaker,
          description: event.description,
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

  buildLabel(eventsCount: number,
      objName: string) {
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

  updateFilter(filter: string,
      objName: string) {
    this.filterByRoom = filter;
    this.timerEvents = this.updateTimerEvents(this.filterByRoom, this.events, this.byRoom);

    this.eventsLabel = this.buildLabel(this.eventsCount, objName);

    SpreadsheetDS.setLocal([this.timerEvents], this.ssIDs.getCacheForNextEvent(objName));
    this.timerEventUpdated.emit([this.timerEvents]);

    SpreadsheetDS.setLocal([this.filterByRoom], this.ssIDs.getCacheForFilter(objName));
    this.filterUpdated.emit([this.filterByRoom]);
  }

  private updateTimerEvents(filter: string,
      events: Array<EventInterface>,
      byRoom: Array<EventRoomInterface>): EventTimerInterface {
    const timerEvents: EventTimerInterface = {
      currentEvents: [],
      nextEvents: []
    };
    if (undefined !== filter && '' !== filter) {
      const room = byRoom.find(obj => obj.name === filter);
      if (undefined !== room) {
        timerEvents.nextEvents = this.getNextEvents(room.events);
        timerEvents.currentEvents = this.getCurrentEvents(room.events);
      }
    } else {
      timerEvents.nextEvents = this.getNextEvents(events);
      timerEvents.currentEvents = this.getCurrentEvents(events);
    }
    return timerEvents;
  }

  getNextEvents(events: Array<EventInterface>): Array<EventInterface> {
    const now = new Date();
    let nextEventTime: Date = undefined;
    let nextEvents: Array<EventInterface> = [];

    events.forEach(event => {
      if (undefined !== event) {
        // Check if the current event is in the future
        let eventSchedule = new Date(event.schedule);
        if (eventSchedule.getTime() >= now.getTime()) {
          // Check if the event is nearer than the current or replaces an undefined value.
          if (undefined === nextEventTime || eventSchedule.getTime() < nextEventTime.getTime()) {
            nextEventTime = eventSchedule;
          }
        }
      }
    });

    events.forEach(event => {
      if (undefined !== event && undefined !== event.schedule) {
        // Check if the current event is in the future
        let eventDate: Date = new Date(event.schedule);
        if (eventDate.getTime() == nextEventTime.getTime()) {
          nextEvents.push(event);
        }
      }
    });

    return nextEvents;
  }

  getCurrentEvents(events: Array<EventInterface>): Array<EventInterface> {
    const now = new Date();
    let currentEvents: Array<EventInterface>;

    events.forEach(event => {
      if (undefined !== event) {
        // Check if the current event end is in the future and it has started
        if (event.end.getTime() >= now.getTime() && event.schedule.getTime() <= now.getTime()) {
          currentEvents.push(event);
        }
      }
    });

    return currentEvents;
  }

  getFirstEvent(events: Array<EventInterface>): EventInterface {
    let firstEvent: EventInterface;

    events.forEach(event => {
      if (undefined !== event) {
        // Check if the event is earlier than the current or replaces an undefined value.
        if (undefined === firstEvent ||
          event.schedule.getTime() < firstEvent.schedule.getTime()) {
          firstEvent = event;
        }
      }
    });

    return firstEvent;
  }

  transformJsonToEventTimerInterfaceArray(events: Array<EventTimerInterface>): Array<EventTimerInterface> {
    events.forEach(eventTimer => {
      if (undefined !== eventTimer && null !== eventTimer) {
        if (undefined !== eventTimer.currentEvents && null !== eventTimer.currentEvents) {
          eventTimer.currentEvents.forEach(event => {
            event.schedule = new Date(event.schedule);
            event.end = new Date(event.end);
          })
        }
        if (undefined !== eventTimer.nextEvents && null !== eventTimer.nextEvents) {
          eventTimer.nextEvents.forEach(event => {
            event.schedule = new Date(event.schedule);
            event.end = new Date(event.end);
          })
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
