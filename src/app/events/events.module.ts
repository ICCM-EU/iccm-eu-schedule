import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { EventsComponent } from './events.component';
import { EventsRoutingModule } from './events-routing.module';
import { CropTextPipe } from '../data/cropText.pipe';

@NgModule({
  declarations: [
    EventsComponent,
    CropTextPipe,
  ],
  imports: [
    EventsRoutingModule,
    SharedModule,
  ]
})
export class EventsModule { }
