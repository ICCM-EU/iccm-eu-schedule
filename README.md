# ICCM Conference Schedule View (Angular)

This project was generated with [Angular CLI](<https://github.com/angular/angular-cli>).

It represents different views on a schedule stored in a google sheet
which is also connected to a conference app, made with <https://glideapps.com/>

## Development server

Run `ng serve --port=4200 --live-reload=true` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build for production

Run `ng build --prod --output-path docs --base-href /iccm-eu-2020/` to build the project. The build artifacts will be stored in the `docs/` directory.

Copy docs/index.html to docs/404.html to allow all content to be provided on github.

Access the production pages at https://iccm-eu.github.io/iccm-eu-schedule/

## Preparing the Google Spreadsheet

The spreadsheet needs to contain at least (see spreadsheetIDs.ts and spreadsheet-data-service.ts) the following entities:

* Tab "Sessions"
  * Session (Title of the time slot)
  * Date & Time (in DateTime format)
  * Time (Text describing the time in natural language)
  * End Date & Time (in DateTime format)
  * Room (Name of the room)
  * Speaker (Name of the person who will lead the sessions)
  * Description

## Preparing access to the spreadsheet

Publish the spreadsheet tabs (venue & sessions) as a website:  Google Sheet / File / Publish / In the Web.

* Setup an API key at https://console.cloud.google.com/apis/credentials
* Restrict the API key to Website https://github.com/ICCM-EU/iccm-eu-schedule/* or your respective URL
* Restrict the API key to the Sheets API.
* Configure the key in spreadsheetIDs.ts

## Configuring Github Pages

In Git Pages, enable the {{github-pages}} plugin, direct it to the "docs/" directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](<https://github.com/angular/angular-cli/blob/master/README.md>).
