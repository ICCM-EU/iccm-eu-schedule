import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

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
  dataObjects: ObjectClass[] = [];

  constructor() {
    /* Register the sheet to be addressed */
    this.dataObjects.push({
      objName: 'events',
      tabName: 'Sessions',
      cache: 'eventsCache',
      cacheByRoom: 'eventsByRoomCache',
      cacheForCalEvents: 'eventsForCalCache',
      cacheForNextEvent: 'eventsNextEventCache',
      cacheForFilter: 'filterCache',
      labelName: 'Event',
    });
  }

  private async initializeSheet(): Promise<GoogleSpreadsheet> {
    let sheet = new GoogleSpreadsheet("1Fs4DzGAEFRDe76D1kNVaO700-Vus4Hrb4CPJeTnAp4U");
    await sheet.useApiKey("AIzaSyBuTzjLoCTjf_-67qELfuH4XyyZNvj60u8");
    await sheet.loadInfo();
    return sheet;
  }

  async printSheetTitle() {
    // console.log("Initializing for printTitle");
    // await this.initializeSheet();
    let sheet = await this.initializeSheet();
    // console.log("Initialized in printTitle");
    // console.log("About to print the title");
    console.log("Title: " + sheet.title);
  }

  async getSheetsByTitle(name: string): Promise<Array<GoogleSpreadsheetWorksheet>> {
    // console.log("Initializing for getSheetsByTitle");
    let sheet: GoogleSpreadsheet = await this.initializeSheet();
    // console.log("Initialized in getSheetsByTitle");
    return sheet.sheetsByTitle[name];
  }

  getColumnValue(row: GoogleSpreadsheetRow, colName: string): string {
    let headers: Array<string> = row._sheet.headerValues;
    let index = headers.indexOf(colName);
    let value: string = row._rawData[index];
    return value;
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
