import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

import { NgxOrderPipe } from '../core/orderBy';

import { CalendarModule, DateAdapter, CalendarDateFormatter, CalendarNativeDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DayViewSchedulerComponent } from './day-view-scheduler.component';
import { CustomDateFormatter } from './customDateFormatter';


@NgModule({
  declarations: [
    ScheduleComponent,
    DayViewSchedulerComponent,
  ],
  imports: [
    ScheduleRoutingModule,
    SharedModule,
    NgxOrderPipe,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CustomDateFormatter
        }
      }
    ),
    CalendarModule,
  ],
  providers: [
    {
      provide: CalendarNativeDateFormatter,
      useClass: CustomDateFormatter,
    }
  ],
})
export class ScheduleModule { }
