import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CalendarUtils, CalendarWeekViewComponent } from 'angular-calendar';
import { WeekView, GetWeekViewArgs } from 'calendar-utils';

// Calculate it from number of user columns
const EVENT_WIDTH = (150 > (window.innerWidth - 70) / 5) ? 150 : ((window.innerWidth - 70) / 5);

interface DayViewScheduler extends WeekView {
  users: any[];
}

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils {
  getWeekView(args: GetWeekViewArgs): DayViewScheduler {
    const view: DayViewScheduler = {
      ...super.getWeekView(args),
      users: []
    };
    view.hourColumns[0].events.forEach(({ event }) => {
      if (!view.users.find(user => user.name === event.meta.user.name)) {
        view.users.push(event.meta.user);
      }
    });

    // sort the users by their names
    view.users.sort((user1, user2) => user1.name.localeCompare(user2.name));
    view.hourColumns[0].events = view.hourColumns[0].events.map(
      dayViewEvent => {
        const userObj = view.users.find(entry => entry.name === dayViewEvent.event.meta.user.name);
        const index = view.users.indexOf(userObj);
        dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
        dayViewEvent.width = EVENT_WIDTH;
        return dayViewEvent;
      }
    );
    return view;
  }
}

@Component({
  // tslint:disable-line max-classes-per-file
  selector: 'app-day-view-scheduler',
  styles: [
    `
      .day-view-column-headers {
        display: flex;
        margin-left: 70px;
      }
      .day-view-column-header {
        width: ` + EVENT_WIDTH + `px;
        border: solid 1px black;
        text-align: center;
      }
      .cal-time-events {
        border-top: solid 1px #e1e1e1;
      }
      .cal-week-view {
        border-top: 0;
      }
    `
  ],
  providers: [
    {
      provide: CalendarUtils,
      useClass: DayViewSchedulerCalendarUtils
    }
  ],
  templateUrl: 'day-view-scheduler.component.html'
})
export class DayViewSchedulerComponent extends CalendarWeekViewComponent {
  @Output() userChanged = new EventEmitter();

  view: DayViewScheduler;
  daysInWeek = 1;
  hourSegmentHeight = 30;
  dayStartHour = 8;
  // tooltipTemplate = './tooltip.html';
  /**
   * Whether to append tooltips to the body or next to the trigger element
   */
  // tooltipAppendToBody: boolean;
  /**
   * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
   * will be displayed immediately.
   */
  // tooltipDelay: number | null;

  eventWidth = EVENT_WIDTH;
}
