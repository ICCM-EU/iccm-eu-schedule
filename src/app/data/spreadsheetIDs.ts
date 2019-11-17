class ObjectClass {
  objName: string;
  tabID: string;
  cache: string;
  cacheByRoom: string;
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
  getCacheName(whichTab: string): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).cache;
  }
  getCacheByRoomName(whichTab: string): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).cacheByRoom;
  }
  getLabelName(whichTab: string): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).labelName;
  }
  getAllTabsURL(): string {
    return this.allTabsURLStart + this.spreadsheetID + this.urlEnd;
  }
}
