import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { ByRoomComponent } from './by-room.component';
import { ByRoomRoutingModule } from './by-room-routing.module';

import { NgxOrderPipe } from '../core/orderBy';

@NgModule({
  declarations: [
    ByRoomComponent
  ],
  imports: [
    ByRoomRoutingModule,
    SharedModule,
    NgxOrderPipe,
  ]
})
export class ByRoomModule { }
