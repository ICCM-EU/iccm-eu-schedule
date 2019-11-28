class ObjectClass {
  objName: string;
  tabID: string;
  cache: string;
  cacheByRoom: string;
  cacheForCalEvents: string;
  labelName: string;
}

export class SpreadsheetIDs {
  tabURLStart: string;
  allTabsURLStart: string;
  spreadsheetID: string;
  urlEnd: string;

  dataObjects: ObjectClass[] = [];

  constructor() {
    if (true) {
      this.tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
      this.allTabsURLStart = 'https://spreadsheets.google.com/feeds/worksheets/';
      // this.spreadsheetID = '1bPW98SzQ5SRsincyVGdP3ctM8ey3oSpncnyo9ASFUDM';
      this.spreadsheetID = '11f_uYNyaHuxM1agro6GpGbyxYlBYj472Pot-QoEbJnI';
      this.urlEnd = '/public/full?alt=json';
      this.dataObjects.push({
        // tabID: 'omyavzt',
        tabID: '262858790',
        objName: 'events',
        cache: 'eventsCache',
        cacheByRoom: 'eventsByRoomCache',
        cacheForCalEvents: 'eventsForCalCache',
        labelName: 'Event'
      });
    } else {
      // this.tabURLStart = '/assets';
      // this.allTabsURLStart = '';
      // this.spreadsheetID = '';
      // this.urlEnd = 'sheet-export.json';
      // this.dataObjects.push({
      //   tabID: '',
      //   objName: 'events',
      //   cache: 'eventsCache',
      //   cacheByRoom: 'eventsByRoomCache',
      //   cacheForCalEvents: 'eventsForCalCache',
      //   labelName: 'Event'
      // });
    }
    console.log('All Tabs URL: ' + this.getAllTabsURL());
    console.log('Tab URL: ' + this.getTabURL('events'));
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
  getLabelName(objName: string): string {
    const cache = this.dataObjects.find(myObj => myObj.objName === objName);
    if (undefined === cache) {
      console.log('Failed to find cache for "' + objName + '"');
    }
    return cache.labelName;
  }
  getAllTabsURL(): string {
    return this.allTabsURLStart + this.spreadsheetID + this.urlEnd;
  }
}
