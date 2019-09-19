import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';

export interface TheEvent {
  Name: string;
  Breed: string;
  Birthdate: Date;
  CurrentAge: number;
}
@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: MatTableDataSource<TheEvent>;
  objName = 'Event';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // the column order
  displayedColumns: string[] = ['Name', 'Breed', 'Birthdate', 'CurrentAge'];

  constructor(public sds: SpreadsheetDS) {

    this.sds.eventsUpdated.subscribe(
      (newData: any) => {
        this.events = new MatTableDataSource(newData);
        this.events.paginator = this.paginator;
        this.events.sort = this.sort;

        this.events.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'Birthdate': return new Date(item.Birthdate);
            default: return item[property];
          }
        };
      }
    );
  }

  ngOnInit() {
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]')
    );
    this.events.paginator = this.paginator;
  }

  refresh() {
    this.sds.loadEvents(this.objName);
  }

  applyFilter(filterValue: string) {
    this.events.filter = filterValue.trim().toLowerCase();

    if (this.events.paginator) {
      this.events.paginator.firstPage();
    }
  }

}
