import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  exports: [
    AppRoutingModule,
  ],
  providers: [
    SpreadsheetDS
  ]
})
export class CoreModule { }
