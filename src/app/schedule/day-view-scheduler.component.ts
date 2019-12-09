import { Component, EventEmitter, Output } from '@angular/core';
import { CalendarUtils, CalendarWeekViewComponent } from 'angular-calendar';
import { DayViewSchedulerInterface } from './dayViewSchedulerInterface';
import { DayViewSchedulerCalendarUtils } from './dayViewSchedulerCalendarUtils';

@Component({
  selector: 'app-day-view-scheduler',
  styles: [
    `
      .day-view-column-headers {
        display: flex;
        margin-left: 70px;
      }
      .day-view-column-header {
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

  view: DayViewSchedulerInterface;
  daysInWeek = 1;
  hourSegmentHeight = DayViewSchedulerCalendarUtils.gethourSegmentHeight();
  dayStartHour = DayViewSchedulerCalendarUtils.getDayStartHour();
  dayEndHour = DayViewSchedulerCalendarUtils.getDayEndHour();
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

  eventWidth = DayViewSchedulerCalendarUtils.getColumnWidth();
  eventWidthPx = DayViewSchedulerCalendarUtils.getColumnWidth() + 'px';
}
