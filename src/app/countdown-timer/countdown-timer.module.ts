import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { CountdownTimerComponent } from './countdown-timer.component';
import { CountdownTimerRoutingModule } from './countdown-timer-routing.module';

@NgModule({
  declarations: [
    CountdownTimerComponent
  ],
  imports: [
    CountdownTimerRoutingModule,
    SharedModule
  ]
})
export class CountdownTimerModule { }
