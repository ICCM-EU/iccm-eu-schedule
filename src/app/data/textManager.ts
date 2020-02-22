import { Injectable } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { EventInterface } from '../data/eventInterface';
import { EventTimerInterface } from '../data/eventTimerInterface';
import { TimerDisplay } from './timerDisplay';

@Injectable()
export class TextManager {
  static cropTextAfter(what: string, where: number, when?: ' '): string {
    if (where <= what.length) {
      let realWhere = what.indexOf(when, where);
      if (realWhere <= where) {
        realWhere = where;
      }
      let out = what.substring(0, realWhere);
      if (out.length !== what.length) {
        out = out + '...';
      }
      return out;
    } else {
      return what;
    }
  }

  static getTimerDisplay(thenTime: Date, sds: SpreadsheetDS): TimerDisplay {
    const display: TimerDisplay = {
      timerString: '--:--',
      timerCssClass: 'countdown-long',
    };

    if (undefined !== thenTime && null !== thenTime) {
      // Calculate / update the time value
      // refresh for more precision
      const now = new Date();
      let timediff: number = thenTime.getTime() - now.getTime();

      if (timediff <= 0) {
        // refresh now, the event has just passed:
        sds.refreshAll();
        // } else {
        //   // schedule a refresh when it is time to update the next event
        //   if (timediff < this.sds.refreshIntervalMin) {
        //     setTimeout(() => { this.sds.refreshAll(); }, timediff);
        //   }
        timediff = -timediff;
      }

      const days: number = timediff / (1000 * 60 * 60 * 24);
      let rest: number = timediff % (1000 * 60 * 60 * 24);
      const hours: number = rest / (1000 * 60 * 60);
      rest = rest % (1000 * 60 * 60);
      const minutes: number = rest / (1000 * 60);
      rest = rest % (1000 * 60);
      const seconds = rest / (1000);

      if (timediff < 1) {
        timediff = -timediff;
        display.timerString = 'NOW';
        display.timerCssClass = 'countdown-10s-uneven';
      } else if (timediff < 2 * 1000) {
        display.timerString = 'NOW';
        display.timerCssClass = 'countdown-10s-uneven';
      } else if (timediff < 3 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-even';
      } else if (timediff < 4 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-uneven';
      } else if (timediff < 5 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-even';
      } else if (timediff < 6 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-uneven';
      } else if (timediff < 7 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-even';
      } else if (timediff < 8 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-uneven';
      } else if (timediff < 9 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-even';
      } else if (timediff < 10 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-uneven';
      } else if (timediff < 11 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-10s-even';
      } else if (timediff < 30 * 1000) {
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-30s';
      } else if (timediff < 60 * 1000) { // coming to less than a minute
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-1m';
      } else if (timediff < 3 * 60 * 1000) { // 3 Minutes
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-3m';
      } else if (timediff < 5 * 60 * 1000) { // 5 Minutes
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-5m';
      } else if (timediff < 60 * 60 * 1000) { // hours and a bit; less than a day
        display.timerString = sprintf('%02d:%02d', minutes, seconds);
        display.timerCssClass = 'countdown-long';
      } else if (timediff < 24 * 60 * 60 * 1000) {
        display.timerString = sprintf('%02dh %02dm %02ds', hours, minutes, seconds);
        display.timerCssClass = 'countdown-long';
      } else { // days and hours (and some minutes)
        display.timerString = sprintf('%dd %02dh %02dm', days, hours, minutes);
        display.timerCssClass = 'countdown-long';
      }
    }
    return display;
  }
}
