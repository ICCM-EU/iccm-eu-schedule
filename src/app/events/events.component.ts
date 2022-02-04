import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventInterface } from '../data/eventInterface';
import { EventTimerInterface } from '../data/eventTimerInterface';
import { EventRoomInterface } from '../data/eventRoomInterface';
import { TimerDisplay } from '../data/timerDisplay';
import { TextManager } from '../data/textManager';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterViewInit {
  events: Array<EventInterface>;
  objName: string;
  toggleName: string;
  toggleDescriptionsName: string;
  onlyUpcoming: boolean;
  showDescriptions: boolean;
  timerDisplay: TimerDisplay;
  roomList: Array<EventRoomInterface>;

  constructor(public sds: SpreadsheetDS, private renderer: Renderer2,
    private router: Router, private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller) {
    this.objName = 'events';
    this.timerDisplay = {
      timerCssClass: '',
      timerString: '',
    };

    if (this.sds.timerEvents.nextEvents.length == 0) {
      this.toggleUpcoming(false);
    } else {
      this.toggleUpcoming(true);
    }
    this.toggleDescriptions(true);

    this.renderer.setStyle(document.body, 'background-color', 'dimgray');
  }

  ngOnInit() {
    this.sds.eventsUpdated.subscribe(
      (newData: EventInterface[]) => {
        this.events = newData;
      }
    );
    this.sds.eventsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)] || '[]'))
    );
    this.sds.byRoomUpdated.subscribe(
      (newData: EventRoomInterface[]) => {
        if (undefined !== newData) {
          this.roomList = newData;
        }
      }
    );
    this.sds.byRoomUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventRoomInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)] || '[]'))
    );

    this.sds.timerEventUpdated.subscribe(
      (next: Array<EventTimerInterface>) => {
        if (next != null) {
          for (const entry of next) {
            let thenTime: Date = undefined;
            if (entry && entry.nextEvents) {
              entry.nextEvents.forEach(event => {
                if (event && event.schedule &&
                    (thenTime === undefined || thenTime.getTime() > event.schedule.getTime())) {
                  thenTime = event.schedule;
                }
              })
            }
            this.timerDisplay = TextManager.getTimerDisplay(thenTime, this.sds);
          }
        }
      }
    );
    this.sds.timerEventUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      this.sds.transformJsonToEventTimerInterfaceArray(
        JSON.parse(localStorage[this.sds.ssIDs.getCacheForNextEvent(this.objName)] || '[]'))
    );

    this.router.events.pipe(
      filter(e => e instanceof Scroll)).subscribe((e: any) => {
        this.viewportScroller.scrollToAnchor(e.anchor);
      });

    // Let the timer run
    this.sds.startTimer();
  }

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.subscribe(f => {
      const element = document.querySelector('#' + f);
      if (element) {
        element.scrollIntoView();
      }
    });
  }

  refresh() {
    this.sds.triggerSheetDataUpdate(this.objName);
  }

  toggleUpcoming(init?: boolean) {
    if (!(init === undefined) && (typeof init === 'boolean')) {
      this.onlyUpcoming = !init;
    }
    if (this.onlyUpcoming) {
      this.toggleName = 'Show Upcoming';
    } else {
      this.toggleName = 'Show All';
    }
    this.onlyUpcoming = !this.onlyUpcoming;
  }

  toggleDescriptions(init?: boolean) {
    if (!(init === undefined) && (typeof init === 'boolean')) {
      this.showDescriptions = !init;
    }
    if (this.showDescriptions) {
      this.toggleDescriptionsName = 'Show Descriptions';
    } else {
      this.toggleDescriptionsName = 'Hide Descriptions';
    }
    this.showDescriptions = !this.showDescriptions;
  }

  updateFilter(updatedValue: string): void {
    this.sds.updateFilter(updatedValue, this.objName);
  }
}
