import { RoomInterface } from './roomInterface';

export interface EventInterface {
  Title: string;
  Schedule: Date;
  End: Date;
  Time: string;
  Speaker: string;
  Room: RoomInterface;
  Upcoming: boolean;
  Description: string;
}
