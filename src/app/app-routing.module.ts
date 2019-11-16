import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const appRoutes: Routes = [
  // { path: '', loadChildren: './countdown-timer/countdown-timer.module#CountdownTimerModule' },
  { path: 'countdown', loadChildren: './countdown-timer/countdown-timer.module#CountdownTimerModule' },
  { path: 'by-room', loadChildren: './by-room/by-room.module#ByRoomModule' },
  { path: '404', loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule' },
  { path: '', loadChildren: './events/events.module#EventsModule' },
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AppRoutingModule { }
