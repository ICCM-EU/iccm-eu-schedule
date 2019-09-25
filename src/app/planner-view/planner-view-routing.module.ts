import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannerViewComponent } from './planner-view.component';

const plannerViewRoutes: Routes = [
  { path: '', component: PlannerViewComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(plannerViewRoutes)
  ],
  exports: [RouterModule]
})
export class PlannerViewRoutingModule {}
