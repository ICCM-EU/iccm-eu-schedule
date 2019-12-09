import { Injectable } from '@angular/core';
import { CalendarUtils } from 'angular-calendar';
import { GetWeekViewArgs } from 'calendar-utils';
import { DayViewSchedulerInterface } from './dayViewSchedulerInterface';

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils {

  public static getColumnWidth(): number {
    // Calculate it from number of user columns
    const userCount = 5;
    return (150 > (window.innerWidth - 70) / userCount) ? 150 : ((window.innerWidth - 70) / userCount);
  }

  public static gethourSegmentHeight(): number {
    // Calculate it from number of user columns
    const hourCount = 16;
    return (15 > (window.innerHeight - 70) / (hourCount * 2)) ? 15 : ((window.innerHeight - 70) / (hourCount * 2));
  }

  getWeekView(args: GetWeekViewArgs): DayViewSchedulerInterface {
    const view: DayViewSchedulerInterface = {
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
        const eventWidth = DayViewSchedulerCalendarUtils.getColumnWidth();
        dayViewEvent.left = index * eventWidth; // change the column of the event
        dayViewEvent.width = eventWidth;
        return dayViewEvent;
      }
    );
    return view;
  }
}
