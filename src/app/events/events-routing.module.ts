import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsComponent } from './events.component';

const eventsRoutes: Routes = [
  { path: '', component: EventsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(eventsRoutes)
  ],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
