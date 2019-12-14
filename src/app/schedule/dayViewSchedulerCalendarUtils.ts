import { Injectable } from '@angular/core';
import { CalendarUtils } from 'angular-calendar';
import { GetWeekViewArgs, WeekViewTimeEvent } from 'calendar-utils';
import { DayViewSchedulerInterface } from './dayViewSchedulerInterface';

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils {
  public static getDayStartHour(): number {
    return 8;
  }

  public static getDayEndHour(): number {
    return 24;
  }

  public static getColumnWidth(innerWidth: number, userCount: number): number {
    return (150 > (innerWidth - 70) / userCount) ? 150 : ((innerWidth - 70) / userCount);
  }

  public static gethourSegmentHeight(innerHeight: number): number {
    // Calculate it from number of user columns
    const hourCount = DayViewSchedulerCalendarUtils.getDayEndHour() - DayViewSchedulerCalendarUtils.getDayStartHour();
    return (15 > (innerHeight - 70) / (hourCount * 2)) ? 15 : ((innerHeight - 70) / (hourCount * 2));
  }

  public static arrangeDayEventsInView(view: DayViewSchedulerInterface): Array<WeekViewTimeEvent> {
    return view.hourColumns[0].events.map(
      dayViewEvent => {
        const userObj = view.users.find(entry => entry.name === dayViewEvent.event.meta.user.name);
        const index = view.users.indexOf(userObj);
        const eventWidth = DayViewSchedulerCalendarUtils.getColumnWidth(window.innerWidth, view.users.length);
        dayViewEvent.left = index * eventWidth; // change the column of the event
        dayViewEvent.width = eventWidth;
        return dayViewEvent;
      }
    );
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
    view.hourColumns[0].events = DayViewSchedulerCalendarUtils.arrangeDayEventsInView(view);

    return view;
  }
}
