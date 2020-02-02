import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ExtraOptions } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'disabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
  preloadingStrategy: PreloadAllModules,
  useHash: true,
  initialNavigation: 'enabled',
};

const appRoutes: Routes = [
  // { path: '', loadChildren: './countdown-timer/countdown-timer.module#CountdownTimerModule' },
  { path: 'countdown', loadChildren: './countdown-timer/countdown-timer.module#CountdownTimerModule' },
  { path: 'by-room', loadChildren: './by-room/by-room.module#ByRoomModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#ScheduleModule' },
  { path: '404', loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule' },
  { path: '', loadChildren: './events/events.module#EventsModule' },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, routerOptions),
  ],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule { }
