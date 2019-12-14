import { Component, EventEmitter, Output, ChangeDetectorRef, OnInit } from '@angular/core';
import { CalendarUtils, CalendarWeekViewComponent, DateAdapter } from 'angular-calendar';
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
    },
  ],
  templateUrl: 'day-view-scheduler.component.html'
})
export class DayViewSchedulerComponent extends CalendarWeekViewComponent implements OnInit {
  @Output() userChanged = new EventEmitter();

  view: DayViewSchedulerInterface;
  eventWidth: number;
  eventWidthPx: string;

  constructor(cdr: ChangeDetectorRef, utils: CalendarUtils, dateAdapter: DateAdapter) {
    super(cdr, utils, '', dateAdapter);

    this.daysInWeek = 1;
    this.hourSegmentHeight = DayViewSchedulerCalendarUtils.gethourSegmentHeight(window.innerHeight);
    this.dayStartHour = DayViewSchedulerCalendarUtils.getDayStartHour();
    this.dayEndHour = DayViewSchedulerCalendarUtils.getDayEndHour();
    // this.tooltipTemplate = './tooltip.html';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    // this.tooltipAppendToBody: boolean;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    // this.tooltipDelay: number | null;
  }

  ngOnInit() {
    this.eventWidth = DayViewSchedulerCalendarUtils.getColumnWidth(window.innerWidth, this.view.users.length);
    this.eventWidthPx = DayViewSchedulerCalendarUtils.getColumnWidth(window.innerWidth, this.view.users.length) + 'px';
  }

  onResize(window: Window) {
    this.hourSegmentHeight = DayViewSchedulerCalendarUtils.gethourSegmentHeight(window.innerHeight);
    this.eventWidth = DayViewSchedulerCalendarUtils.getColumnWidth(window.innerWidth, this.view.users.length);
    this.eventWidthPx = this.eventWidth + 'px';
    this.view.hourColumns[0].events = DayViewSchedulerCalendarUtils.arrangeDayEventsInView(this.view);
  }
}
