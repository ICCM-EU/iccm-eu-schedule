import { CalendarEvent } from 'angular-calendar';
import { RoomsDictionary } from './roomsDictionary';

export interface CalEventEmitterInterface {
  events: Array<CalendarEvent>;
  rooms: RoomsDictionary;
}
