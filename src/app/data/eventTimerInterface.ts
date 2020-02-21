import { EventInterface } from './eventInterface';

export interface EventTimerInterface {
  // currently running event
  currentEvent?: EventInterface;
  // Next event in the future
  nextEvent?: EventInterface;
}
