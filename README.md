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
   * Room  (as specified in more detail in the Venue tab)
  * Speaker (Name of the person who will lead the sessions)
  * Description
* Tab "Venue"
  * Name

## Preparing access to the spreadsheet

Setup a google service account.

Publish the spreadsheet tabs (venue & sessions) as a website:  Google Sheet / File / Publish / In the Web.

Potentially, also grant read access to the spreadsheet to the service account. 

## Configuring Github Pages

In Git Pages, enable the {{github-pages}} plugin, direct it to the "docs" directory.

Export the Environments section, set the following environment variables with the Google service account mail address and access key:

* GOOGLE_SHEET_CODE - https://docs.google.com/spreadsheets/d/YOURGOOGLESHEETCODE/
* GOOGLE_API_USER - Your service.account@googlemail.com
* GOOGLE_API_KEY - The key configured as access token

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](<https://github.com/angular/angular-cli/blob/master/README.md>).
