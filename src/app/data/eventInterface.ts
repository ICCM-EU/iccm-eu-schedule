import { RoomInterface } from './roomInterface';

export interface EventInterface {
  title: string;
  schedule: Date;
  end: Date;
  time: string;
  speaker: string;
  room: RoomInterface;
  upcoming: boolean;
  description: string;
}
