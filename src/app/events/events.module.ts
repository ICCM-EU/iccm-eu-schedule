import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { EventsComponent } from './events.component';
import { EventsRoutingModule } from './events-routing.module';

@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    EventsRoutingModule,
    SharedModule,
  ]
})
export class EventsModule { }
