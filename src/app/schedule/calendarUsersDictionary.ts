import { CalendarColorsInterface } from './calendarColorsInterface';

interface UsersInterface {
  name: string;
  colors: CalendarColorsInterface;
}

export interface CalendarUsersDictionary {
  [index: string]: UsersInterface;
}
