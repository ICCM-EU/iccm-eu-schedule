import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

import { OrderModule } from 'ngx-order-pipe';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DayViewSchedulerComponent } from './day-view-scheduler.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    DayViewSchedulerComponent,
  ],
  imports: [
    ScheduleRoutingModule,
    SharedModule,
    OrderModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class ScheduleModule { }
