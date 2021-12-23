import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Observable } from 'rxjs';

class ObjectClass {
  objName: string;
  tabName: string;
  cache: string;
  cacheByRoom: string;
  cacheForCalEvents: string;
  cacheForNextEvent: string;
  cacheForFilter: string;
  labelName: string;
}

export class SpreadsheetIDs {
  sheet: GoogleSpreadsheet;
  dataObjects: ObjectClass[] = [];

  constructor() {
    this.sheet = new GoogleSpreadsheet();//process.env.GOOGLE_SHEET_CODE);
    this.sheet.useServiceAccountAuth({
      // env var values are copied from service account credentials generated by google
      // see "Authentication" section in docs for more info
      client_email: "",//process.env.GOOGLE_API_USER,
      private_key: "",//process.env.GOOGLE_API_KEY,
    });
    this.sheet.loadInfo();

    /* Register the sheet to be addressed */
    this.dataObjects.push({
      objName: 'events',
      tabName: 'Sessions',
      cache: 'eventsCache',
      cacheByRoom: 'eventsByRoomCache',
      cacheForCalEvents: 'eventsForCalCache',
      cacheForNextEvent: 'eventsNextEventCache',
      cacheForFilter: 'filterCache',
      labelName: 'Event'
    });
  }

  getSheetRows(objName: string): Observable<Array<any>> {
    const tabName = this.getTabName(objName);
    const tab = this.sheet.sheetsByTitle(tabName);
    const rows = tab.getRows();
    console.log("rows:\n" + rows + "\n");
    return rows;
  }

  getObjNames(): string[] {
    return this.dataObjects.map(obj => obj.objName);
  }

  getTabName(objName: string): string {
    const tab = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === tab) {
      console.log('Failed to find tabName for "' + objName + '"');
    }
    return tab.tabName;
  }

  getCacheName(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.cache;
  }
  getCacheByRoomName(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.cacheByRoom;
  }
  getCacheForCalEvents(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.cacheForCalEvents;
  }
  getCacheForNextEvent(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.cacheForNextEvent;
  }
  getCacheForFilter(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.cacheForFilter;
  }
  getLabelName(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.labelName;
  }
}
