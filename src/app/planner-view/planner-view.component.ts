import { Component, OnInit, Renderer2 } from '@angular/core';

import { CalendarDateFormatter } from 'angular-calendar';
import { SchedulerDateFormatter } from 'angular-calendar-scheduler';

@Component({
  selector: 'app-planner-view',
  templateUrl: './planner-view.component.html',
  styleUrls: ['./planner-view.component.css'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})
export class PlannerViewComponent implements OnInit {

  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit() {
    title = 'Angular Calendar Scheduler Demo';

    CalendarView = CalendarView;

    view: CalendarView = CalendarView.Week;
    viewDate: Date = new Date();
    refreshSubject: Subject < any > = new Subject();
    locale: string = 'en';
    weekStartsOn: number = 1;
    startsWithToday: boolean = true;
    activeDayIsOpen: boolean = true;
    excludeDays: number[] = []; // [0];
    weekendDays: number[] = [0, 6];
    dayStartHour: number = 6;
    dayEndHour: number = 22;

    minDate: Date = new Date();
    maxDate: Date = endOfDay(addMonths(new Date(), 1));
    dayModifier: Function;
    hourModifier: Function;
    segmentModifier: Function;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

    actions: CalendarSchedulerEventAction[] = [
      {
        when: 'enabled',
        label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
        title: 'Delete',
        onClick: (event: CalendarSchedulerEvent): void => {
          console.log('Pressed action \'Delete\' on event ' + event.id);
        }
      },
      {
        when: 'disabled',
        label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
        title: 'Restore',
        onClick: (event: CalendarSchedulerEvent): void => {
          console.log('Pressed action \'Restore\' on event ' + event.id);
        }
      }
    ];

    events: CalendarSchedulerEvent[];

    constructor(@Inject(LOCALE_ID) locale: string, private appService: AppService) {
      this.locale = locale;

      this.dayModifier = ((day: SchedulerViewDay): void => {
        if (!this.isDateValid(day.date)) {
          day.cssClass = 'cal-disabled';
        }
      }).bind(this);
      this.hourModifier = ((hour: SchedulerViewHour): void => {
        if (!this.isDateValid(hour.date)) {
          hour.cssClass = 'cal-disabled';
        }
      }).bind(this);
      this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
        if (!this.isDateValid(segment.date)) {
          segment.isDisabled = true;
        }
      }).bind(this);

      this.dateOrViewChanged();
    }

    ngOnInit(): void {
      this.appService.getEvents(this.actions)
        .then((events: CalendarSchedulerEvent[]) => this.events = events);
    }

    changeDate(date: Date): void {
      console.log('changeDate', date);
      this.viewDate = date;
      this.dateOrViewChanged();
    }

    changeView(view: CalendarPeriod): void {
      console.log('changeView', view);
      this.view = view;
      this.dateOrViewChanged();
    }

    dateOrViewChanged(): void {
      if(this.startsWithToday) {
      this.prevBtnDisabled = !this.isDateValid(subPeriod(this.view, this.viewDate, 1));
      this.nextBtnDisabled = !this.isDateValid(addPeriod(this.view, this.viewDate, 1));
    } else {
      this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1)));
      this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1)));
    }

    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  private isDateValid(date: Date): boolean {
    return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked Hour', hour);
  }

  segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
    console.log('segmentClicked Action', action);
    console.log('segmentClicked Segment', segment);
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    console.log('eventClicked Action', action);
    console.log('eventClicked Event', event);
  }

  eventTimesChanged({ event, newStart, newEnd }: SchedulerEventTimesChangedEvent): void {
    console.log('eventTimesChanged Event', event);
    console.log('eventTimesChanged New Times', newStart, newEnd);
    let ev = this.events.find(e => e.id === event.id);
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
  }
}
