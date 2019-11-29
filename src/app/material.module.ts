import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatSelectModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatSelectModule,
  ],
  exports: [
    MatButtonModule,
    MatSelectModule,
  ]
})
export class MaterialModule {}
