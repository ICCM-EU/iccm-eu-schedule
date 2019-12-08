import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { ByRoomComponent } from './by-room.component';
import { ByRoomRoutingModule } from './by-room-routing.module';

import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    ByRoomComponent
  ],
  imports: [
    ByRoomRoutingModule,
    SharedModule,
    OrderModule,
  ]
})
export class ByRoomModule { }
