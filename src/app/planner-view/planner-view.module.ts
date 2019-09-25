import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { PlannerViewComponent } from './planner-view.component';
import { PlannerViewRoutingModule } from './planner-view-routing.module';

import { CalendarModule } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';

@NgModule({
  declarations: [
    PlannerViewComponent
  ],
  imports: [
    PlannerViewRoutingModule,
    SharedModule,
    CalendarModule.forRoot(),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
  ]
})
export class EventsModule { }
