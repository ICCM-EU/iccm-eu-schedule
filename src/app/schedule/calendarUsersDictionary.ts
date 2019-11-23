import { EventColor } from 'calendar-utils';

interface UsersInterface {
  name: string;
  colors?: EventColor;
}

export interface CalendarUsersDictionary {
  [index: string]: UsersInterface;
}
