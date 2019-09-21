import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';

export interface TheEvent {
  Title: string;
  Schedule: Date;
  Time: string;
  Room: string;
}
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: MatTableDataSource<TheEvent>;
  objName = 'events';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // the column order
  displayedColumns: string[] = ['Title', 'Room', 'Speaker', 'Time', 'Schedule', 'Upcoming'];

  constructor(public sds: SpreadsheetDS) {

    this.sds.eventsUpdated.subscribe(
      (newData: any) => {
        this.events = new MatTableDataSource(newData);
        this.events.paginator = this.paginator;
        this.events.sort = this.sort;

        this.events.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'Schedule':
            case 'Time':
              return new Date(item.Schedule);
            default:
              return item[property];
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
