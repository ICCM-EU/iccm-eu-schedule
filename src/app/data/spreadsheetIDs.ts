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
    this.sheet = new GoogleSpreadsheet("1Fs4DzGAEFRDe76D1kNVaO700-Vus4Hrb4CPJeTnAp4U");
    this.sheet.useApiKey("AIzaSyBuTzjLoCTjf_-67qELfuH4XyyZNvj60u8");
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
    this.sheet.loadInfo();
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
