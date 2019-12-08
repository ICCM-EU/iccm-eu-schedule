class ObjectClass {
  objName: string;
  tabID: string;
  cache: string;
  cacheByRoom: string;
  cacheForCalEvents: string;
  cacheForNextEvent: string;
  cacheForFilter: string;
  labelName: string;
}

export class SpreadsheetIDs {
  tabURLStart: string;
  spreadsheetID: string;
  urlEnd: string;

  dataObjects: ObjectClass[] = [];

  constructor(useTestData: boolean) {
    if (useTestData) {
      // https://spreadsheets.google.com/feeds/list/YOURGOOGLESHEETCODE/SHEETPAGENUMBER/public/full?alt=json
      this.tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
      this.spreadsheetID = '11f_uYNyaHuxM1agro6GpGbyxYlBYj472Pot-QoEbJnI';
      this.urlEnd = '/public/full?alt=json';
      this.dataObjects.push({
        tabID: '2',
        objName: 'events',
        cache: 'eventsCache',
        cacheByRoom: 'eventsByRoomCache',
        cacheForCalEvents: 'eventsForCalCache',
        cacheForNextEvent: 'eventsNextEventCache',
        cacheForFilter: 'filterCache',
        labelName: 'Event'
      });
    } else {
      this.tabURLStart = '/assets';
      this.spreadsheetID = '';
      this.urlEnd = 'sheet-export.json';
      this.dataObjects.push({
        tabID: '',
        objName: 'events',
        cache: 'eventsCache',
        cacheByRoom: 'eventsByRoomCache',
        cacheForCalEvents: 'eventsForCalCache',
        cacheForNextEvent: 'eventsNextEventCache',
        cacheForFilter: 'filterCache',
        labelName: 'Event'
      });
    }
    // console.log('Tab URL: ' + this.getTabURL('events'));
  }

  getObjNames(): string[] {
    return this.dataObjects.map(obj => obj.objName);
  }

  getTabURL(whichTab: string): string {
    return this.tabURLStart + this.spreadsheetID + '/' +
      this.dataObjects.find(myObj => myObj.objName === whichTab).tabID +
      this.urlEnd;
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
