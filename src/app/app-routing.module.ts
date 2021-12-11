import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions, PreloadAllModules } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'disabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0],
    preloadingStrategy: PreloadAllModules,
    useHash: true,
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy'
};

const appRoutes: Routes = [
  // { path: '', loadChildren: './countdown-timer/countdown-timer.module#CountdownTimerModule' },
  { path: 'countdown', loadChildren: () => import('./countdown-timer/countdown-timer.module').then(m => m.CountdownTimerModule) },
  { path: 'by-room', loadChildren: () => import('./by-room/by-room.module').then(m => m.ByRoomModule) },
  { path: 'schedule', loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule) },
  { path: '404', loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
  { path: '', loadChildren: () => import('./events/events.module').then(m => m.EventsModule) },
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
