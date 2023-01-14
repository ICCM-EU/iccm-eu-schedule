import { Component, EventEmitter, Output, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { CalendarUtils, CalendarWeekViewComponent, DateAdapter, CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DayViewSchedulerInterface } from './dayViewSchedulerInterface';
import { DayViewSchedulerCalendarUtils } from './dayViewSchedulerCalendarUtils';
import { CustomEventTitleFormatter } from './customEventTitleFormatter';
import { TextManager } from '../data/textManager';


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
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    },
  ],
  templateUrl: 'day-view-scheduler.component.html',
})
export class DayViewSchedulerComponent extends CalendarWeekViewComponent implements OnInit {
  @Output() userChanged = new EventEmitter();

  txtMgr = new TextManager();
  view: DayViewSchedulerInterface;
  eventWidth: number;
  eventWidthPx: string;

  constructor(cdr: ChangeDetectorRef, utils: CalendarUtils, dateAdapter: DateAdapter, element: ElementRef<HTMLElement>) {
    super(cdr, utils, '', dateAdapter, element);

    this.daysInWeek = 1;
    this.hourSegmentHeight = DayViewSchedulerCalendarUtils.gethourSegmentHeight(window.innerHeight);
    this.dayStartHour = DayViewSchedulerCalendarUtils.getDayStartHour();
    this.dayEndHour = DayViewSchedulerCalendarUtils.getDayEndHour();
    // this.tooltipTemplate = new TemplateRef('customEventTooltipTemplate');
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = false;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = 300;
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

  getTooltipText(event: CalendarEvent): string {
    let output = event.title;
    if (event.meta.speaker && event.meta.speaker !== '') {
      output += '<br/>(' + event.meta.speaker + ')';
    }
    if (event.meta.description && event.meta.description !== '') {
      output += '<br/><hr/>' + TextManager.cropTextAfter(event.meta.description, 120);
    }
    return output;
  }
}
