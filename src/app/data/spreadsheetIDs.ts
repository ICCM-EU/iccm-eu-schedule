import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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
    // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
    const serviceAccountAuth = new JWT({
      // env var values here are copied from service account credentials generated by google
      // see "Authentication" section in docs for more info
      email: "", // process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: "AIzaSyBuTzjLoCTjf_-67qELfuH4XyyZNvj60u8", // process.env.GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
    let sheet = new GoogleSpreadsheet("1dFLWrcbI1AltIvVCEjBx9I3I3d0ToGN2FmzcFuAYsZE", serviceAccountAuth);
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

  async getSheetByTitle(name: string): Promise<GoogleSpreadsheetWorksheet> {
    // console.log("Initializing for getSheetsByTitle");
    let sheet: GoogleSpreadsheet = await this.initializeSheet();
    // console.log("Initialized in getSheetsByTitle");
    return sheet.sheetsByTitle[name];
  }

  getColumnValue(row: GoogleSpreadsheetRow, colName: string): string {
    let headers: Array<string> = row._worksheet.headerValues;
    let index = headers.indexOf(colName);
    let value: string = row[index];
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
