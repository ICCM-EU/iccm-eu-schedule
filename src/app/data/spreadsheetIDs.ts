class ObjectClass {
  objName: string;
  tabID: string;
  cache: string;
  cacheByRoom: string;
  cacheForCalEvents: string;
  labelName: string;
}

export class SpreadsheetIDs {
  // tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
  // allTabsURLStart = 'https://spreadsheets.google.com/feeds/worksheets/';
  // spreadsheetID = '1bPW98SzQ5SRsincyVGdP3ctM8ey3oSpncnyo9ASFUDM';
  // urlEnd = '/public/full?alt=json';
  tabURLStart = '/assets';
  allTabsURLStart = '';
  spreadsheetID = '';
  urlEnd = 'sheet-export.json';

  dataObjects: ObjectClass[] = [
    {
      // object name
      objName: 'events',
      // tabID: 'omyavzt',
      tabID: '',
      cache: 'eventsCache',
      cacheByRoom: 'eventsByRoomCache',
      cacheForCalEvents: 'eventsForCalCache',
      labelName: 'Event'
    },
  ];

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
