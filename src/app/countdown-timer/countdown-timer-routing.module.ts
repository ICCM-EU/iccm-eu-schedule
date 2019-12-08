import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountdownTimerComponent } from './countdown-timer.component';

const countdownTimerRoutes: Routes = [
  { path: '', component: CountdownTimerComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(countdownTimerRoutes)
  ],
  exports: [RouterModule]
})
export class CountdownTimerRoutingModule {}
