import { EventInterface } from './eventInterface';
import { RoomInterface } from './roomInterface';

export interface EventRoomInterface extends RoomInterface {
  events: EventInterface[];
}
