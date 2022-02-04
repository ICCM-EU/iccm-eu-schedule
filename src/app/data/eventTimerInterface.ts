import { EventInterface } from './eventInterface';

export interface EventTimerInterface {
  // currently running event
  currentEvents: Array<EventInterface>;
  // Next event in the future
  nextEvents: Array<EventInterface>;
}
