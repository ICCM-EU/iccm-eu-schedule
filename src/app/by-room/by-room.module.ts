import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { ByRoomComponent } from './by-room.component';
import { ByRoomRoutingModule } from './by-room-routing.module';

@NgModule({
  declarations: [
    ByRoomComponent
  ],
  imports: [
    ByRoomRoutingModule,
    SharedModule
  ]
})
export class ByRoomModule { }
