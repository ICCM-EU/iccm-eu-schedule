import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ByRoomComponent } from './by-room.component';

const byRoomRoutes: Routes = [
  { path: '', component: ByRoomComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(byRoomRoutes)
  ],
  exports: [RouterModule]
})
export class ByRoomRoutingModule {}
