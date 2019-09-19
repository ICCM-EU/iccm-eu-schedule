export class SpreadsheetIDs {
  // tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
  // allTabsURLStart = 'https://spreadsheets.google.com/feeds/worksheets/';
  // spreadsheetID = '1bPW98SzQ5SRsincyVGdP3ctM8ey3oSpncnyo9ASFUDM';
  // urlEnd = '/public/full?alt=json';
  tabURLStart = '/assets';
  allTabsURLStart = '';
  spreadsheetID = '';
  urlEnd = 'sheet-export.json';

  dataObjects = [
    {
      objName: 'Events',
      // tabID: 'omyavzt',
      tabID: '',
      cache: 'dogsCache',
      labelName: 'Dog'
    },
  ];

  getTabURL(whichTab: string): string {
    return this.tabURLStart + this.spreadsheetID + '/' +
      this.dataObjects.find(myObj => myObj.objName === whichTab).tabID +
      this.urlEnd;
  }
  getCacheName(whichTab: string): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).cache;
  }
  getLabelName(whichTab: string): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).labelName;
  }
  getAllTabsURL(): string {
    return this.allTabsURLStart + this.spreadsheetID + this.urlEnd;
  }
}
